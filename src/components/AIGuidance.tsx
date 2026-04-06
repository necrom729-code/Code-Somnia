"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

interface Question {
  id: number;
  question: string;
  options: { label: string; response: string }[];
}

const getQuestions = (lang: string): Question[] => {
  const questionsByLang: Record<string, Question[]> = {
    en: [
      {
        id: 1,
        question: "NEED HELP WITH FILES?",
        options: [
          { label: "UPLOAD", response: "Drag files onto the drop zone or click the upload button. Max size 100MB per file." },
          { label: "DOWNLOAD", response: "Click any file to preview, then use the download button in the preview modal." },
          { label: "ORGANIZE", response: "Create folders to group files. Click the + button next to Folders to create new ones." },
        ],
      },
      {
        id: 2,
        question: "SEARCHING FOR SOMETHING?",
        options: [
          { label: "BY NAME", response: "Type in the search bar. Results filter in real-time as you type." },
          { label: "BY TYPE", response: "Use the filter dropdown to show only documents, videos, images, etc." },
          { label: "BY DATE", response: "Sort by modified date. Click the column header in list view." },
        ],
      },
      {
        id: 3,
        question: "SECURITY CONCERNS?",
        options: [
          { label: "PROTECT DATA", response: "Enable all protections in the Security Control Center. VPN encrypts your connection." },
          { label: "BACKUP", response: "Go to Security > Backups to create restore points. Recommended weekly." },
          { label: "PRIVACY", response: "Disable tracking in Privacy settings. Your data stays local." },
        ],
      },
      {
        id: 4,
        question: "STORAGE FULL?",
        options: [
          { label: "CHECK USAGE", response: "View storage in the dashboard. Shows used/total with breakdown by file type." },
          { label: "FREE SPACE", response: "Delete unused files or old backups. Create more space instantly." },
          { label: "GET MORE", response: "Upgrade in Settings > Storage. Plans start at 100GB." },
        ],
      },
      {
        id: 5,
        question: "CHANGE APPEARANCE?",
        options: [
          { label: "THEME", response: "Go to Settings > Appearance. Choose Cyberpunk, Matrix, Blood, Ghost, or Neon." },
          { label: "LANGUAGE", response: "Click the globe icon in nav. 8 languages available." },
          { label: "AVATAR", response: "Go to Settings > Profile to change your icon." },
        ],
      },
    ],
    es: [
      {
        id: 1,
        question: "¿NECESITAS AYUDA CON ARCHIVOS?",
        options: [
          { label: "SUBIR", response: "Arrastra archivos a la zona de subida o haz clic en el botón. Tamaño máx 100MB por archivo." },
          { label: "DESCARGAR", response: "Haz clic en cualquier archivo para previsualizar, luego usa el botón de descarga." },
          { label: "ORGANIZAR", response: "Crea carpetas para agrupar archivos. Haz clic en + junto a Carpetas." },
        ],
      },
      {
        id: 2,
        question: "¿BUSCANDO ALGO?",
        options: [
          { label: "POR NOMBRE", response: "Escribe en la barra de búsqueda. Los resultados se filtran en tiempo real." },
          { label: "POR TIPO", response: "Usa el desplegable de filtro para mostrar solo documentos, videos, imágenes, etc." },
          { label: "POR FECHA", response: "Ordena por fecha de modificación. Haz clic en el encabezado de columna." },
        ],
      },
      {
        id: 3,
        question: "¿PROBLEMAS DE SEGURIDAD?",
        options: [
          { label: "PROTEGER", response: "Activa todas las protecciones en el Centro de Control. La VPN encripta tu conexión." },
          { label: "RESPALDO", response: "Ve a Seguridad > Respaldos para crear puntos de restauración. Recomendado semanal." },
          { label: "PRIVACIDAD", response: "Desactiva el rastreo en Privacidad. Tus datos permanecen locales." },
        ],
      },
      {
        id: 4,
        question: "¿ALMACENAMIENTO LLENO?",
        options: [
          { label: "VER USO", response: "Mira el almacenamiento en el panel. Muestra usado/total con desglose por tipo." },
          { label: "LIBERAR", response: "Elimina archivos sin usar o respaldos antiguos. Crea espacio al instante." },
          { label: "MÁS ESPACIO", response: "Mejora en Configuración > Almacenamiento. Planes desde 100GB." },
        ],
      },
      {
        id: 5,
        question: "¿CAMBIAR ASPECTO?",
        options: [
          { label: "TEMA", response: "Ve a Configuración > Apariencia. Elige Cyberpunk, Matrix, Blood, Ghost o Neon." },
          { label: "IDIOMA", response: "Haz clic en el icono de globo en navegación. 8 idiomas disponibles." },
          { label: "AVATAR", response: "Ve a Configuración > Perfil para cambiar tu icono." },
        ],
      },
    ],
    fr: [
      {
        id: 1,
        question: "BESOIN D'AIDE POUR LES FICHIERS?",
        options: [
          { label: "UPLOAD", response: "Glissez les fichiers ou cliquez sur le bouton. Taille max 100MB par fichier." },
          { label: "DOWNLOAD", response: "Cliquez sur un fichier pour prévisualiser, puis utilisez le bouton de téléchargement." },
          { label: "ORGANISER", response: "Créez des dossiers. Cliquez sur + à côté de Dossiers." },
        ],
      },
      {
        id: 2,
        question: "CHERCHEZ QUELQUE CHOSE?",
        options: [
          { label: "PAR NOM", response: "Tapez dans la barre de recherche. Les résultats filtrent en temps réel." },
          { label: "PAR TYPE", response: "Utilisez le filtre pour afficher uniquement documents, vidéos, images, etc." },
          { label: "PAR DATE", response: "Triez par date de modification. Cliquez sur l'en-tête de colonne." },
        ],
      },
      {
        id: 3,
        question: "PROBLÈMES DE SÉCURITÉ?",
        options: [
          { label: "PROTÉGER", response: "Activez toutes les protections. Le VPN chiffre votre connexion." },
          { label: "SAUVEGARDE", response: "Allez dans Sécurité > Sauvegardes pour créer des points de restauration." },
          { label: "VIE PRIVÉE", response: "Désactivez le pistage dans Vie privée. Vos données restent locales." },
        ],
      },
      {
        id: 4,
        question: "STOCKAGE PLEIN?",
        options: [
          { label: "VÉRIFIER", response: "Consultez le stockage. Affiche utilisé/total avec répartition par type." },
          { label: "LIBÉRER", response: "Supprimez fichiers inutilisés ou anciennes sauvegardes. Créez de l'espace." },
          { label: "PLUS", response: "Mettez à niveau dans Paramètres > Stockage. Plans à partir de 100Go." },
        ],
      },
      {
        id: 5,
        question: "CHANGER L'ASPECT?",
        options: [
          { label: "THÈME", response: "Allez dans Paramètres > Apparence. Choisissez Cyberpunk, Matrix, Blood, Ghost ou Neon." },
          { label: "LANGUE", response: "Cliquez sur l'icône globe dans la navigation. 8 langues disponibles." },
          { label: "AVATAR", response: "Allez dans Paramètres > Profil pour changer votre icône." },
        ],
      },
    ],
    de: [
      {
        id: 1,
        question: "HILFE MIT DATEIEN BENÖTIGT?",
        options: [
          { label: "HOCHLADEN", response: "Dateien in den Upload-Bereich ziehen oder auf Button klicken. Max 100MB pro Datei." },
          { label: "HERUNTERLADEN", response: "Klicken Sie auf eine Datei zum Vorschauen, dann den Download-Button nutzen." },
          { label: "ORGANISIEREN", response: "Erstellen Sie Ordner. Klicken Sie auf + neben Ordner." },
        ],
      },
      {
        id: 2,
        question: "SUCHEN SIE ETWAS?",
        options: [
          { label: "NAME", response: "Tippen Sie in die Suchleiste. Ergebnisse filtern in Echtzeit." },
          { label: "TYP", response: "Nutzen Sie das Filter-Dropdown für nur Dokumente, Videos, Bilder, etc." },
          { label: "DATUM", response: "Sortieren nach Änderungsdatum. Klick auf Spaltenüberschrift." },
        ],
      },
      {
        id: 3,
        question: "SICHERHEITSBEDENKEN?",
        options: [
          { label: "SCHÜTZEN", response: "Aktivieren Sie alle Schutzmaßnahmen. VPN verschlüsselt Ihre Verbindung." },
          { label: "BACKUP", response: "Gehen Sie zu Sicherheit > Backups für Wiederherstellungspunkte." },
          { label: "PRIVATSPHÄRE", response: "Deaktivieren Sie Tracking. Ihre Daten bleiben lokal." },
        ],
      },
      {
        id: 4,
        question: "SPEICHER VOLL?",
        options: [
          { label: "PRÜFEN", response: "Speicher im Dashboard anzeigen. Zeigt verwendet/gesamt mit Aufschlüsselung." },
          { label: "FREIGEBEN", response: "Löschen Sie ungenutzte Dateien oder alte Backups. Platz sofort schaffen." },
          { label: "MEHR", response: "Upgrade in Einstellungen > Speicher. Pläne ab 100GB." },
        ],
      },
      {
        id: 5,
        question: "DARSTELLUNG ÄNDERN?",
        options: [
          { label: "THEMA", response: "Gehen Sie zu Einstellungen > Darstellung. Wählen Sie Cyberpunk, Matrix, Blood, Ghost oder Neon." },
          { label: "SPRACHE", response: "Klicken Sie auf Globe-Symbol. 8 Sprachen verfügbar." },
          { label: "AVATAR", response: "Gehen Sie zu Einstellungen > Profil um Ihr Symbol zu ändern." },
        ],
      },
    ],
    zh: [
      {
        id: 1,
        question: "需要文件帮助？",
        options: [
          { label: "上传", response: "拖拽文件到上传区或点击上传按钮。每个文件最大100MB。" },
          { label: "下载", response: "点击任意文件进行预览，然后使用预览模态框中的下载按钮。" },
          { label: "整理", response: "创建文件夹来分组文件。点击文件夹旁边的+按钮创建新文件夹。" },
        ],
      },
      {
        id: 2,
        question: "在搜索什么？",
        options: [
          { label: "按名称", response: "在搜索栏中输入。结果会实时过滤。" },
          { label: "按类型", response: "使用筛选下拉菜单只显示文档、视频、图片等。" },
          { label: "按日期", response: "按修改日期排序。点击列表视图中的列标题。" },
        ],
      },
      {
        id: 3,
        question: "安全问题？",
        options: [
          { label: "保护数据", response: "在安全控制中心启用所有保护。VPN加密您的连接。" },
          { label: "备份", response: "进入安全 > 备份创建还原点。建议每周一次。" },
          { label: "隐私", response: "在隐私设置中禁用追踪。您的数据保留在本地。" },
        ],
      },
      {
        id: 4,
        question: "存储满了？",
        options: [
          { label: "查看使用", response: "在仪表板查看存储。显示已用/总量及按文件类型细分。" },
          { label: "释放空间", response: "删除未使用的文件或旧备份。立即创建更多空间。" },
          { label: "获取更多", response: "在设置 > 存储中升级。套餐从100GB起。" },
        ],
      },
      {
        id: 5,
        question: "改变外观？",
        options: [
          { label: "主题", response: "进入设置 > 外观。选择Cyberpunk、Matrix、Blood、Ghost或Neon。" },
          { label: "语言", response: "点击导航中的地球图标。提供8种语言。" },
          { label: "头像", response: "进入设置 > 个人资料更改您的图标。" },
        ],
      },
    ],
    ja: [
      {
        id: 1,
        question: "ファイルのヘルプが必要？",
        options: [
          { label: "アップロード", response: "ファイルをドロップゾーンにドラッグするか、アップロードボタンをクリック。最大100MB/ファイル。" },
          { label: "ダウンロード", response: "ファイルをプレビューし、プレビューモーダルのダウンロードボタンを使用。" },
          { label: "整理", response: "フォルダを作成してファイルをグループ化。フォルダの横の+ボタンをクリック。" },
        ],
      },
      {
        id: 2,
        question: "何かを探してる？",
        options: [
          { label: "名前で", response: "検索バーに入力。リアルタイムで結果がフィルタリングされます。" },
          { label: "種類で", response: "フィルタードロップダウンでドキュメント、動画、画像のみ表示。" },
          { label: "日付で", response: "更新日付でソート。リストビューの列ヘッダーをクリック。" },
        ],
      },
      {
        id: 3,
        question: "セキュリティの問題？",
        options: [
          { label: "データ保護", response: "セキュリティコントロールセンターですべての保護を有効に。VPNが接続を暗号化。" },
          { label: "バックアップ", response: "セキュリティ > バックアップで復元ポイントを作成。毎週推奨。" },
          { label: "プライバシー", response: "プライバシー設定でトラッキングを無効に。データはローカルのまま。" },
        ],
      },
      {
        id: 4,
        question: "ストレージ不足？",
        options: [
          { label: "使用状況確認", response: "ダッシュボードでストレージを確認。使用/合計とファイルタイプ別内訳を表示。" },
          { label: "空き容量確保", response: "未使用のファイルや古いバックアップを削除。瞬時に容量を作成。" },
          { label: "容量追加", response: "設定 > ストレージでアップグレード。プランは100GBから。" },
        ],
      },
      {
        id: 5,
        question: "外観を変更？",
        options: [
          { label: "テーマ", response: "設定 > 外観に移動。Cyberpunk、Matrix、Blood、Ghost、Neonから選択。" },
          { label: "言語", response: "ナビゲーションの globo アイコンをクリック。8言語対応。" },
          { label: "アバター", response: "設定 > プロフィールでアイコンを変更。" },
        ],
      },
    ],
    ms: [
      {
        id: 1,
        question: "PERLU BANTUAN DENGAN FAIL?",
        options: [
          { label: "MUAT NAIK", response: "Seret fail ke zon muat naik atau klik butang muat naik. Saiz maks 100MB setiap fail." },
          { label: "MUAT TURUN", response: "Klik mana-mana fail untuk pratonton, kemudian gunakan butang muat turun." },
          { label: "SUSUN", response: "Cipta folder untuk kumpulkan fail. Klik butang + di sebelah Folder." },
        ],
      },
      {
        id: 2,
        question: "MENCARI SESUATU?",
        options: [
          { label: "MENGIKUT NAMA", response: "Taip dalam bar carian. Keputusan ditapis secara masa nyata." },
          { label: "MENGIKUT JENIS", response: "Gunakan dropdown penapis untuk tunjukkan hanya dokumen, video, imej, dll." },
          { label: "MENGIKUT TARIKH", response: "Susun mengikut tarikh diubah. Klik pengepala lajur dalam paparan senarai." },
        ],
      },
      {
        id: 3,
        question: "KERINGANAN Keselamatan?",
        options: [
          { label: "LINDUNGI DATA", response: "Dayakan semua perlindungan dalam Pusat Kawalan Keselamatan. VPN menyulitan sambungan anda." },
          { label: "SANDARAN", response: "Pergi ke Keselamatan > Sandaran untuk titik pemulihan. Disyorkan setiap minggu." },
          { label: "PRIVASI", response: "Lumpuhkan penjejakan dalam tetapan Privasi. Data anda kekal setempat." },
        ],
      },
      {
        id: 4,
        question: "STORAGE PENUH?",
        options: [
          { label: "PERIKSA PENGGUNAAN", response: "Lihat storage dalam papan pemuka. Shows used/total with breakdown by file type." },
          { label: "KOSONGKAN RUANG", response: "Padam fail yang tidak digunakan atau sandaran lama. Buat ruang dengan segera." },
          { label: "DAPATKAN LEBIH", response: "Upgrade dalam Tetapan > Storage. Pelan bermula dari 100GB." },
        ],
      },
      {
        id: 5,
        question: "TUKAR PENAMPILAN?",
        options: [
          { label: "TEMA", response: "Pergi ke Tetapan > Penampilan. Pilih Cyberpunk, Matrix, Blood, Ghost atau Neon." },
          { label: "BAHASA", response: "Klik ikon glob dalam navigasi. 8 bahasa tersedia." },
          { label: "AVATAR", response: "Pergi ke Tetapan > Profil untuk tukar ikon anda." },
        ],
      },
    ],
    id: [
      {
        id: 1,
        question: "BUTUH BANTUAN FILE?",
        options: [
          { label: "UNGGAH", response: "Seret file ke zona unggah atau klik tombolunggah. Ukuran maks 100MB per file." },
          { label: "UNDUH", response: "Klik file mana pun untuk pratinjau, lalu gunakan tombol unduh." },
          { label: "KELOLA", response: "Buat folder untuk mengelompokkan file. Klik tombol + di samping Folder." },
        ],
      },
      {
        id: 2,
        question: "MENCARI SESUATU?",
        options: [
          { label: "NAMA", response: "Ketik di bilah pencarian. Hasil filter secara real-time." },
          { label: "TIPE", response: "Gunakan dropdown filter untuk tampilkan hanya dokumen, video, gambar, dll." },
          { label: "TANGGAL", response: "Urutkan berdasarkan tanggal modifikasi. Klik header kolom di tampilan daftar." },
        ],
      },
      {
        id: 3,
        question: "KEKHATIRAN KEAMANAN?",
        options: [
          { label: "LINDUNGI DATA", response: "Aktifkan semua perlindungan di Pusat Kontrol Keamanan. VPN mengenkripsi koneksi Anda." },
          { label: "CADANGAN", response: "Ke Keamanan > Cadangan untuk titik pemulihan. Direkomendasikan mingguan." },
          { label: "PRIVASI", response: "Nonaktifkan pelacakan di Pengaturan Privasi. Data Anda tetap lokal." },
        ],
      },
      {
        id: 4,
        question: "STORAGE PENUH?",
        options: [
          { label: "CEK PENGGUNAAN", response: "Lihat storage di dashboard. Menampilkan digunakan/-total dengan breakdown per tipe file." },
          { label: "KOSONGKAN", response: "Hapus file yang tidak terpakai atau cadangan lama. Buat ruang dengan segera." },
          { label: "TAMBAH", response: "Upgrade di Pengaturan > Storage. Paket mulai dari 100GB." },
        ],
      },
      {
        id: 5,
        question: "UBAH TAMPILAN?",
        options: [
          { label: "TEMA", response: "Ke Pengaturan > Tampilan. Pilih Cyberpunk, Matrix, Blood, Ghost, atau Neon." },
          { label: "BAHASA", response: "Klik ikon glob di navigasi. 8 bahasa tersedia." },
          { label: "AVATAR", response: "Ke Pengaturan > Profil untuk mengubah ikon Anda." },
        ],
      },
    ],
  };

  return questionsByLang[lang] || questionsByLang["en"];
};

export default function AIGuidance({ questions: _questions }: { questions?: Question[] }) {
  const { language } = useI18n();
  const questions = getQuestions(language);
  const [isVisible, setIsVisible] = useState(true);
  const [currentQ, setCurrentQ] = useState<Question>(questions[0]);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mode, setMode] = useState<"idle" | "question" | "response">("question");
  const [eyeGlow, setEyeGlow] = useState<"idle" | "angry" | "furious" | "warning">("idle");
  const [jawState, setJawState] = useState<"closed" | "open" | "snarl">("closed");
  const [floatingY, setFloatingY] = useState(0);
  const [wobble, setWobble] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingY(Math.sin(Date.now() / 600) * 4);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && mode === "idle") {
        setWobble(Math.sin(Date.now() / 400) * 5);
      } else {
        setWobble(0);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isHovered, mode]);

  useEffect(() => {
    if (mode === "question" && displayText === "") {
      typeQuestion(currentQ.question);
    }
  }, [mode, currentQ, displayText]);

  useEffect(() => {
    if (mode === "response" && selectedResponse) {
      typeResponse(selectedResponse);
    }
  }, [mode, selectedResponse]);

  useEffect(() => {
    setCurrentQ(questions[0]);
    setMode("question");
    setDisplayText("");
    setShowOptions(false);
    setSelectedResponse(null);
  }, [language]);

  const typeQuestion = (text: string) => {
    setIsTyping(true);
    setEyeGlow("warning");
    setJawState("closed");
    let i = 0;
    setDisplayText("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setShowOptions(true);
        setEyeGlow("idle");
      }
    }, 40);
  };

  const typeResponse = (text: string) => {
    setIsTyping(true);
    setEyeGlow("angry");
    setJawState("snarl");
    let i = 0;
    setDisplayText("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setEyeGlow("idle");
        setJawState("closed");
        setTimeout(() => {
          setSelectedResponse(null);
          setShowOptions(false);
          setDisplayText("");
          setMode("idle");
          nextQuestion();
        }, 5000);
      }
    }, 30);
  };

  const nextQuestion = () => {
    setTimeout(() => {
      setCurrentQ(questions[(questions.indexOf(currentQ) + 1) % questions.length]);
      setMode("question");
    }, 2000);
  };

  const handleOptionClick = (option: { label: string; response: string }) => {
    setSelectedResponse(option.response);
    setShowOptions(false);
    setMode("response");
    setEyeGlow("furious");
  };

  const handleHover = () => {
    setIsHovered(true);
    setEyeGlow("furious");
    setMode("question");
  };

  const handleLeave = () => {
    setIsHovered(false);
    setEyeGlow("idle");
  };

  const eyeColor = eyeGlow === "idle" ? "#ff0000" : eyeGlow === "angry" ? "#ff3300" : eyeGlow === "furious" ? "#ff0066" : "#ffff00";
  const glowIntensity = eyeGlow === "idle" ? 15 : eyeGlow === "angry" ? 25 : eyeGlow === "furious" ? 35 : 20;

  const SkullIcon = () => (
    <svg viewBox="0 0 100 120" width="80" height="90" style={{ filter: `drop-shadow(0 0 ${glowIntensity}px ${eyeColor})`, transition: "filter 0.2s" }}>
      <ellipse cx="50" cy="60" rx="38" ry="45" fill="#0a0000" stroke="#ff0000" strokeWidth="2"/>
      <ellipse cx="30" cy="50" rx="14" ry="16" fill="#000" stroke="#ff0000" strokeWidth="1.5"/>
      <ellipse cx="70" cy="50" rx="14" ry="16" fill="#000" stroke="#ff0000" strokeWidth="1.5"/>
      {(eyeGlow === "furious" || isTyping) && (
        <>
          <path d="M 15 45 L 28 48" stroke="#ff0000" strokeWidth="2" fill="none"/>
          <path d="M 85 45 L 72 48" stroke="#ff0000" strokeWidth="2" fill="none"/>
        </>
      )}
      <ellipse cx="30" cy="52" r="8" ry="11" fill={eyeColor} style={{ filter: `drop-shadow(0 0 ${isTyping ? 18 : 12}px ${eyeColor})` }}/>
      <ellipse cx="70" cy="52" r="8" ry="11" fill={eyeColor} style={{ filter: `drop-shadow(0 0 ${isTyping ? 18 : 12}px ${eyeColor})` }}/>
      <path d="M 50 70 L 46 85 L 54 85 Z" fill="#050000" stroke="#ff0000" strokeWidth="1"/>
      {jawState === "closed" && (
        <path d="M 25 95 Q 50 102 75 95" stroke="#ff0000" strokeWidth="2" fill="none"/>
      )}
      {jawState === "snarl" && (
        <path d="M 20 90 Q 50 110 80 90" stroke="#ff0000" strokeWidth="2" fill="none" style={{ filter: "drop-shadow(0 0 4px #ff0000)" }}/>
      )}
      {jawState === "open" && (
        <ellipse cx="50" cy="95" rx="12" ry="10" fill="#000" stroke="#ff0000" strokeWidth="1.5"/>
      )}
      <line x1="30" y1="102" x2="30" y2="115" stroke="#ff0000" strokeWidth="1.5"/>
      <line x1="40" y1="102" x2="40" y2="115" stroke="#ff0000" strokeWidth="1.5"/>
      <line x1="50" y1="102" x2="50" y2="115" stroke="#ff0000" strokeWidth="1.5"/>
      <line x1="60" y1="102" x2="60" y2="115" stroke="#ff0000" strokeWidth="1.5"/>
      <line x1="70" y1="102" x2="70" y2="115" stroke="#ff0000" strokeWidth="1.5"/>
    </svg>
  );

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-30 p-3 rounded-full border transition-all duration-300 hover:scale-110"
        style={{ background: "rgba(20, 0, 0, 0.95)", borderColor: "#ff0000", boxShadow: "0 0 25px rgba(255, 0, 0, 0.4)" }}
      >
        <SkullIcon />
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ background: "#ff0000", boxShadow: "0 0 10px #ff0000" }}/>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-30 cursor-pointer"
      style={{
        transform: `translateY(${floatingY}px) rotate(${wobble}deg)`,
        transition: "transform 0.1s ease",
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className="absolute bottom-full right-16 mb-4 w-72" style={{ transform: isHovered ? "scale(1)" : "scale(0.95)", transition: "transform 0.3s" }}>
        <div className="p-4 rounded-lg border" style={{ 
          background: "rgba(30, 0, 0, 0.95)", 
          borderColor: "#ff0000",
          boxShadow: "0 0 40px rgba(255, 0, 0, 0.3), inset 0 0 30px rgba(255, 0, 0, 0.1)",
        }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-mono uppercase tracking-wider" style={{ color: "#ff3333", textShadow: "0 0 10px #ff0000" }}>
              {isTyping && <span className="animate-pulse mr-1">▊</span>}
              {displayText}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
              className="text-xs px-1 hover:bg-red-900/50"
              style={{ color: "#ff3333" }}
            >
              ✕
            </button>
          </div>

          {showOptions && (
            <div className="mt-3 grid gap-2">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className="text-xs py-2 px-3 border transition-all duration-200 hover:bg-red-900/30"
                  style={{ 
                    borderColor: "#660000", 
                    color: "#ff6666",
                    textShadow: "0 0 5px #ff0000",
                  }}
                >
                  [{opt.label}]
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <SkullIcon />

      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" style={{ background: eyeColor, boxShadow: `0 0 10px ${eyeColor}` }}/>
    </div>
  );
}