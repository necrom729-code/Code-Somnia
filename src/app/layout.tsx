import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { NotificationsProvider } from "@/lib/notifications";
import { SecurityProvider } from "@/lib/security";
import ThemeApplier from "@/components/ThemeApplier";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NECROM // Cloud Server",
  description: "Necrom — Secure digital cloud infrastructure. Files, media, and data storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <AuthProvider>
            <NotificationsProvider>
              <SecurityProvider>
                <ThemeApplier />
                {children}
              </SecurityProvider>
            </NotificationsProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
