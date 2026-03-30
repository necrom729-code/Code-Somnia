# Recipe: Add User Storage System

Add user storage system with individual storage spaces and Google account integration.

## When to Use

- User needs personal storage space
- Application requires file management per user
- Features need data isolation between users

## Prerequisites

- Database already set up (use add-database recipe first)
- Authentication already set up (use add-auth recipe first)

## Setup Steps

### Step 1: Update Database Schema

Update `src/db/schema.ts` to add storage-related tables:

```typescript
import { sqliteTable, text, integer, blob, foreignKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  storageQuota: integer("storage_quota").$defaultFn(() => 1073741824), // 1GB default
  storageUsed: integer("storage_used").$defaultFn(() => 0),
});

export const files = sqliteTable("files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  metadata: blob("metadata"),
});

export const storageUsage = sqliteTable("storage_usage", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  totalStorage: integer("total_storage").notNull(),
  usedStorage: integer("used_storage").notNull(),
  lastUpdated: integer("last_updated", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
```

### Step 2: Create Storage Service

#### `src/lib/storage.ts` - Storage management service

```typescript
import { db } from "@/db";
import { files, users, storageUsage } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface FileMetadata {
  type: "file" | "folder";
  size: number;
  mimeType: string;
  uploadedAt: Date;
  metadata?: any;
}

export interface UserStorageInfo {
  userId: number;
  totalStorage: number;
  usedStorage: number;
  freeStorage: number;
  percentUsed: number;
}

export class StorageService {
  async getUserStorage(userId: number): Promise<UserStorageInfo> {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const usage = await db.select().from(storageUsage).where(eq(storageUsage.userId, userId)).limit(1);
    
    if (!user[0]) {
      throw new Error("User not found");
    }

    const totalStorage = user[0].storageQuota;
    const usedStorage = usage[0]?.usedStorage || 0;
    
    return {
      userId,
      totalStorage,
      usedStorage,
      freeStorage: totalStorage - usedStorage,
      percentUsed: (usedStorage / totalStorage) * 100,
    };
  }

  async uploadFile(userId: number, file: File, path: string): Promise<FileMetadata> {
    const fileMetadata: FileMetadata = {
      type: "file",
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
    };

    // Check storage quota
    const storageInfo = await this.getUserStorage(userId);
    if (storageInfo.usedStorage + file.size > storageInfo.totalStorage) {
      throw new Error("Insufficient storage space");
    }

    // Save file to storage
    const fileId = await this.saveFileToStorage(file, path);
    
    // Update database
    await db.insert(files).values({
      userId,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      path,
      metadata: JSON.stringify(fileMetadata),
    });

    // Update storage usage
    await db.update(users)
      .set({ storageUsed: storageInfo.usedStorage + file.size })
      .where(eq(users.id, userId));

    await db.update(storageUsage)
      .set({ usedStorage: storageInfo.usedStorage + file.size, lastUpdated: new Date() })
      .where(eq(storageUsage.userId, userId))
      .onConflict(storageUsage.userId)
      .merge();

    return fileMetadata;
  }

  async deleteFile(userId: number, fileId: number): Promise<void> {
    const file = await db.select().from(files).where(eq(files.id, fileId)).limit(1);
    
    if (!file[0] || file[0].userId !== userId) {
      throw new Error("File not found or access denied");
    }

    // Delete from storage
    await this.deleteFileFromStorage(file[0].path);

    // Update database
    await db.delete(files).where(eq(files.id, fileId));

    // Update storage usage
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    await db.update(users)
      .set({ storageUsed: user[0].storageUsed - file[0].size })
      .where(eq(users.id, userId));

    await db.update(storageUsage)
      .set({ usedStorage: user[0].storageUsed - file[0].size, lastUpdated: new Date() })
      .where(eq(storageUsage.userId, userId));
  }

  async listFiles(userId: number, path: string = "/"): Promise<FileMetadata[]> {
    const userFiles = await db.select().from(files).where(eq(files.userId, userId));
    
    return userFiles.map(file => ({
      type: "file",
      size: file.size,
      mimeType: file.mimeType,
      uploadedAt: new Date(file.uploadedAt),
      metadata: file.metadata ? JSON.parse(file.metadata) : undefined,
    }));
  }

  async createFolder(userId: number, path: string): Promise<void> {
    // Implementation for folder creation
    console.log(`Creating folder ${path} for user ${userId}`);
  }

  private async saveFileToStorage(file: File, path: string): Promise<string> {
    // Implement file storage logic (could be local, cloud, etc.)
    // For now, return a mock file ID
    return `file-${Date.now()}-${file.name}`;
  }

  private async deleteFileFromStorage(path: string): Promise<void> {
    // Implement file deletion logic
    console.log(`Deleting file from storage: ${path}`);
  }
}

export const storageService = new StorageService();
```

### Step 3: Create Storage Components

#### `src/components/UserStorage.tsx` - Storage usage display

```typescript
import { useAuth } from "@/lib/auth";
import { storageService } from "@/lib/storage";

export function UserStorage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Total: 1 GB</span>
          <span>Used: 250 MB</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: '25%' }}
          ></div>
        </div>
        <div className="text-sm text-gray-600">
          Free: 750 MB (75%)
        </div>
      </div>
    </div>
  );
}
```

#### `src/components/FileManager.tsx` - File management interface

```typescript
import { useAuth } from "@/lib/auth";
import { storageService } from "@/lib/storage";

export function FileManager() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">File Manager</h3>
      <div className="space-y-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Upload File
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <div className="text-sm text-gray-600 mb-2">Document.pdf</div>
            <div className="flex justify-between items-center">
              <span>2.3 MB</span>
              <button className="text-red-600 hover:text-red-800">Delete</button>
            </div>
          </div>
          <div className="border rounded p-4">
            <div className="text-sm text-gray-600 mb-2">Image.jpg</div>
            <div className="flex justify-between items-center">
              <span>850 KB</span>
              <button className="text-red-600 hover:text-red-800">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Add Storage API Routes

#### `src/app/api/storage/route.ts` - Storage API

```typescript
import { NextResponse } from "next/server";
import { storageService } from "@/lib/storage";

export async function POST() {
  try {
    // Handle file upload
    return NextResponse.json({ success: true, message: "File uploaded successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Handle file deletion
    return NextResponse.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

## Usage Examples

### Using Storage Service

```typescript
import { storageService } from "@/lib/storage";

// Upload a file
const file = new File([content], "document.pdf", { type: "application/pdf" });
await storageService.uploadFile(userId, file, "/documents/document.pdf");

// List files
const files = await storageService.listFiles(userId);

// Delete a file
await storageService.deleteFile(userId, fileId);
```

## Memory Bank Updates

After implementing, update `.kilocode/rules/memory-bank/context.md`:

- Add storage system to "Recently Completed" section
- Document the storage components and services created
- Note any API routes or server actions added

Also update `.kilocode/rules/memory-bank/tech.md`:

- Add storage service to dependencies
- Document storage file structure
- Note any environment variables needed

## Environment Variables

Add these to your `.env.local` file:

```
STORAGE_BACKEND=local|aws|s3|google-cloud
STORAGE_PATH=./storage
```

## Google Integration

For Google account integration, you'll need to:

1. Set up Google Cloud project
2. Enable Google Drive API
3. Configure OAuth credentials
4. Use Google Drive as storage backend

This recipe provides the foundation. You can extend it to integrate with Google Drive for actual storage using Google's APIs.