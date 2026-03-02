"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, startTransition } from "react";

export type Language = "en" | "es" | "fr" | "de" | "zh" | "ja";

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
  { code: "de", name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
];

type Translations = Record<Language, Record<string, string>>;

const translations: Translations = {
  en: {
    // Navigation
    "nav.settings": "SETTINGS",
    "nav.signIn": "SIGN IN",
    "nav.signOut": "SIGN OUT",
    "nav.register": "REGISTER",
    
    // Home
    "home.title": "NECROM",
    "home.subtitle": "// SECURE DIGITAL INFRASTRUCTURE",
    "home.description": "Encrypted cloud storage with military-grade security. Store, manage, and access your files, videos, audio, and data from anywhere. Every byte is protected.",
    "home.encryption": "ENCRYPTION",
    "home.uptime": "UPTIME",
    "home.storage": "STORAGE",
    "home.breaches": "BREACHES",
    
    // Security
    "security.title": "SECURITY FEATURES",
    "security.subtitle": "// ACTIVE PROTECTION SYSTEMS",
    "security.allEnabled": "ALL SYSTEMS ACTIVE",
    "security.someEnabled": "SYSTEMS PARTIALLY ACTIVE",
    "security.allDisabled": "SYSTEMS OFFLINE",
    "security.enableAll": "ENABLE ALL",
    "security.viewDetails": "VIEW DETAILS",
    "security.threatsBlocked": "THREATS BLOCKED",
    "security.lastScan": "LAST SCAN",
    "security.never": "Never",
    "security.antivirus": "ANTIVIRUS",
    "security.vpn": "PRIVACY VPN",
    "security.firewall": "FIREWALL",
    "security.encryption": "END-TO-END",
    "security.watchdogs": "WATCHDOGS",
    "security.audit": "AUDIT LOG",
    "security.description.antivirus": "Real-time threat detection & removal",
    "security.description.vpn": "Encrypted tunnel for all connections",
    "security.description.firewall": "Advanced packet filtering & monitoring",
    "security.description.encryption": "Military-grade AES-256 encryption",
    "security.description.watchdogs": "24/7 intrusion detection system",
    "security.description.audit": "Complete activity tracking & forensics",
    
    // Storage
    "storage.title": "BACKUP SERVER",
    "storage.used": "Used",
    "storage.free": "Free",
    "storage.total": "Total Storage",
    "storage.ssd": "NVMe SSD",
    
    // File Manager
    "files.title": "FILE SYSTEM",
    "files.upload": "UPLOAD",
    "files.newFolder": "NEW FOLDER",
    "files.search": "Search files...",
    "files.allTypes": "All Types",
    "files.images": "Images",
    "files.videos": "Videos",
    "files.audio": "Audio",
    "files.documents": "Documents",
    "files.archives": "Archives",
    "files.noFiles": "No files found",
    "files.dropFiles": "Drop files here to upload",
    
    // Settings
    "settings.title": "SYSTEM SETTINGS",
    "settings.appearance": "// APPEARANCE & THEME",
    "settings.language": "// LANGUAGE",
    "settings.account": "// ACCOUNT",
    "settings.active": "ACTIVE",
    "settings.currentLanguage": "Current Language",
    "settings.languageDescription": "Interface language preference is saved locally.",
    "settings.signOut": "SIGN OUT",
    "settings.signedInAs": "Signed in as",
    "settings.themeNote": "Theme preference is saved locally and applied on next visit.",
    
    // Auth
    "auth.signIn": "SIGN IN",
    "auth.signUp": "CREATE ACCOUNT",
    "auth.email": "EMAIL",
    "auth.password": "PASSWORD",
    "auth.username": "USERNAME",
    "auth.rememberMe": "REMEMBER ME",
    "auth.forgotPassword": "Forgot password?",
    "auth.noAccount": "NO ACCOUNT?",
    "auth.hasAccount": "Already have an account?",
    "auth.createAccount": "Create account",
    "auth.createAccountLink": "CREATE OPERATOR PROFILE",
    "auth.login": "Login",
    "auth.terminalTitle": "SECURE ACCESS TERMINAL",
    "auth.operatorAuth": "OPERATOR AUTHENTICATION",
    "auth.emailLabel": "EMAIL ADDRESS",
    "auth.emailPlaceholder": "operator@necrom.sys",
    "auth.passwordLabel": "PASSWORD",
    "auth.passwordPlaceholder": "••••••••••••",
    "auth.authenticating": "AUTHENTICATING...",
    "auth.accessSystem": "ACCESS SYSTEM",
    "auth.encryptionNote": "ALL CONNECTIONS ENCRYPTED // AES-256",
    "auth.register": "REGISTER",
    
    // Notifications
    "notifications.title": "NOTIFICATIONS",
    "notifications.clearAll": "Clear All",
    "notifications.markAllRead": "Mark all read",
    "notifications.empty": "No notifications",
    "notifications.virusDetected": "VIRUS DETECTED",
    "notifications.threatBlocked": "Threat blocked by {protection}",
    "notifications.systemClean": "System clean complete",
    "notifications.backupComplete": "Backup completed",
    "notifications.daysSinceClean": "{days} days since last clean",
    "notifications.cleanNow": "Clean Now",
    
    // Footer
    "footer.tagline": "NECROM CLOUD // ALL DATA ENCRYPTED // WATCH_DOGS PROTOCOL ACTIVE",
    "footer.build": "SYS_BUILD: 2026.02.27 — NODE: ctOS-7",
    
    // Common
    "common.save": "SAVE",
    "common.cancel": "CANCEL",
    "common.delete": "DELETE",
    "common.restore": "RESTORE",
    "common.close": "CLOSE",
    "common.yes": "YES",
    "common.no": "NO",
    "common.on": "ON",
    "common.off": "OFF",
    "common.enabled": "ENABLED",
    "common.disabled": "DISABLED",
  },
  es: {
    // Navigation
    "nav.settings": "AJUSTES",
    "nav.signIn": "INICIAR SESIÓN",
    "nav.signOut": "CERRAR SESIÓN",
    "nav.register": "REGISTRARSE",
    
    // Home
    "home.title": "NECROM",
    "home.subtitle": "// INFRAESTRUCTURA DIGITAL SEGURA",
    "home.description": "Almacenamiento en la nube encriptado con seguridad militar. Almacena, gestiona y accede a tus archivos, videos, audio y datos desde cualquier lugar. Cada byte está protegido.",
    "home.encryption": "ENCRIPTACIÓN",
    "home.uptime": "DISPONIBILIDAD",
    "home.storage": "ALMACENAMIENTO",
    "home.breaches": "BRECHAS",
    
    // Security
    "security.title": "CARACTERÍSTICAS DE SEGURIDAD",
    "security.subtitle": "// SISTEMAS DE PROTECCIÓN ACTIVOS",
    "security.allEnabled": "TODOS LOS SISTEMAS ACTIVOS",
    "security.someEnabled": "SISTEMAS PARCIALMENTE ACTIVOS",
    "security.allDisabled": "SISTEMAS INACTIVOS",
    "security.enableAll": "ACTIVAR TODO",
    "security.viewDetails": "VER DETALLES",
    "security.threatsBlocked": "AMENAZAS BLOQUEADAS",
    "security.lastScan": "ÚLTIMO ESCANEO",
    "security.never": "Nunca",
    "security.antivirus": "ANTIVIRUS",
    "security.vpn": "VPN PRIVADA",
    "security.firewall": "CORTAFUEGOS",
    "security.encryption": "CIFRADO EXTREMO",
    "security.watchdogs": "VIGILANTES",
    "security.audit": "REGISTRO DE AUDITORÍA",
    "security.description.antivirus": "Detección y eliminación de amenazas en tiempo real",
    "security.description.vpn": "Túnel encriptado para todas las conexiones",
    "security.description.firewall": "Filtrado avanzado de paquetes y monitoreo",
    "security.description.encryption": "Cifrado AES-256 de grado militar",
    "security.description.watchdogs": "Sistema de detección de intrusiones 24/7",
    "security.description.audit": "Seguimiento completo de actividad y forense",
    
    // Storage
    "storage.title": "SERVIDOR DE RESPALDO",
    "storage.used": "Usado",
    "storage.free": "Libre",
    "storage.total": "Almacenamiento Total",
    "storage.ssd": "NVMe SSD",
    
    // File Manager
    "files.title": "SISTEMA DE ARCHIVOS",
    "files.upload": "SUBIR",
    "files.newFolder": "NUEVA CARPETA",
    "files.search": "Buscar archivos...",
    "files.allTypes": "Todos los Tipos",
    "files.images": "Imágenes",
    "files.videos": "Videos",
    "files.audio": "Audio",
    "files.documents": "Documentos",
    "files.archives": "Archivos",
    "files.noFiles": "No se encontraron archivos",
    "files.dropFiles": "Suelta archivos aquí para subir",
    
    // Settings
    "settings.title": "AJUSTES DEL SISTEMA",
    "settings.appearance": "// APARIENCIA Y TEMA",
    "settings.language": "// IDIOMA",
    "settings.account": "// CUENTA",
    "settings.active": "ACTIVO",
    "settings.currentLanguage": "Idioma Actual",
    "settings.languageDescription": "La preferencia de idioma de la interfaz se guarda localmente.",
    "settings.signOut": "CERRAR SESIÓN",
    "settings.signedInAs": "Sesión iniciada como",
    "settings.themeNote": "La preferencia de tema se guarda localmente y se aplica en la próxima visita.",
    
    // Auth
    "auth.signIn": "INICIAR SESIÓN",
    "auth.signUp": "CREAR CUENTA",
    "auth.email": "CORREO",
    "auth.password": "CONTRASEÑA",
    "auth.username": "USUARIO",
    "auth.rememberMe": "RECORDARME",
    "auth.forgotPassword": "¿Olvidaste la contraseña?",
    "auth.noAccount": "¿NO TIENES CUENTA?",
    "auth.hasAccount": "¿Ya tienes cuenta?",
    "auth.createAccount": "Crear cuenta",
    "auth.createAccountLink": "CREAR PERFIL DE OPERADOR",
    "auth.login": "Iniciar sesión",
    "auth.terminalTitle": "TERMINAL DE ACCESO SEGURO",
    "auth.operatorAuth": "AUTENTICACIÓN DEL OPERADOR",
    "auth.emailLabel": "DIRECCIÓN DE CORREO",
    "auth.emailPlaceholder": "operador@necrom.sys",
    "auth.passwordLabel": "CONTRASEÑA",
    "auth.passwordPlaceholder": "••••••••••••",
    "auth.authenticating": "AUTENTICANDO...",
    "auth.accessSystem": "ACCEDER AL SISTEMA",
    "auth.encryptionNote": "TODAS LAS CONEXIONES ENCRIPTADAS // AES-256",
    "auth.register": "REGISTRARSE",
    
    // Notifications
    "notifications.title": "NOTIFICACIONES",
    "notifications.clearAll": "Borrar Todo",
    "notifications.markAllRead": "Marcar todo leído",
    "notifications.empty": "Sin notificaciones",
    "notifications.virusDetected": "VIRUS DETECTADO",
    "notifications.threatBlocked": "Amenaza bloqueada por {protection}",
    "notifications.systemClean": "Limpieza del sistema completada",
    "notifications.backupComplete": "Respaldo completado",
    "notifications.daysSinceClean": "{days} días desde la última limpieza",
    "notifications.cleanNow": "Limpiar Ahora",
    
    // Footer
    "footer.tagline": "NECROM CLOUD // TODOS LOS DATOS ENCRIPTADOS // PROTOCOLO WATCH_DOGS ACTIVO",
    "footer.build": "SYS_BUILD: 2026.02.27 — NODO: ctOS-7",
    
    // Common
    "common.save": "GUARDAR",
    "common.cancel": "CANCELAR",
    "common.delete": "ELIMINAR",
    "common.restore": "RESTAURAR",
    "common.close": "CERRAR",
    "common.yes": "SÍ",
    "common.no": "NO",
    "common.on": "ON",
    "common.off": "OFF",
    "common.enabled": "ACTIVADO",
    "common.disabled": "DESACTIVADO",
  },
  fr: {
    // Navigation
    "nav.settings": "PARAMÈTRES",
    "nav.signIn": "CONNEXION",
    "nav.signOut": "DÉCONNEXION",
    "nav.register": "S'INSCRIRE",
    
    // Home
    "home.title": "NECROM",
    "home.subtitle": "// INFRASTRUCTURE NUMÉRIQUE SÉCURISÉE",
    "home.description": "Stockage cloud chiffré avec sécurité de niveau militaire. Stockez, gérez et accédez à vos fichiers, vidéos, audio et données de n'importe où. Chaque octet est protégé.",
    "home.encryption": "CHIFFREMENT",
    "home.uptime": "DISPONIBILITÉ",
    "home.storage": "STOCKAGE",
    "home.breaches": "VIOLATIONS",
    
    // Security
    "security.title": "FONCTIONNALITÉS DE SÉCURITÉ",
    "security.subtitle": "// SYSTÈMES DE PROTECTION ACTIFS",
    "security.allEnabled": "TOUS LES SYSTÈMES ACTIFS",
    "security.someEnabled": "SYSTÈMES PARTIELLEMENT ACTIFS",
    "security.allDisabled": "SYSTÈMES HORS LIGNE",
    "security.enableAll": "ACTIVER TOUT",
    "security.viewDetails": "VOIR DÉTAILS",
    "security.threatsBlocked": "MENACES BLOQUÉES",
    "security.lastScan": "DERNIER SCAN",
    "security.never": "Jamais",
    "security.antivirus": "ANTIVIRUS",
    "security.vpn": "VPN PRIVÉ",
    "security.firewall": "PARE-FEU",
    "security.encryption": "CHIFFREMENT",
    "security.watchdogs": "GARDIENS",
    "security.audit": "JOURNAL D'AUDIT",
    "security.description.antivirus": "Détection et suppression des menaces en temps réel",
    "security.description.vpn": "Tunnel chiffré pour toutes les connexions",
    "security.description.firewall": "Filtrage avancé des paquets et surveillance",
    "security.description.encryption": "Chiffrement AES-256 de qualité militaire",
    "security.description.watchdogs": "Système de détection d'intrusion 24/7",
    "security.description.audit": "Suivi complet de l'activité et forensique",
    
    // Storage
    "storage.title": "SERVEUR DE SAUVEGARDE",
    "storage.used": "Utilisé",
    "storage.free": "Libre",
    "storage.total": "Stockage Total",
    "storage.ssd": "NVMe SSD",
    
    // File Manager
    "files.title": "SYSTÈME DE FICHIERS",
    "files.upload": "TÉLÉCHARGER",
    "files.newFolder": "NOUVEAU DOSSIER",
    "files.search": "Rechercher des fichiers...",
    "files.allTypes": "Tous les Types",
    "files.images": "Images",
    "files.videos": "Vidéos",
    "files.audio": "Audio",
    "files.documents": "Documents",
    "files.archives": "Archives",
    "files.noFiles": "Aucun fichier trouvé",
    "files.dropFiles": "Déposez les fichiers ici pour télécharger",
    
    // Settings
    "settings.title": "PARAMÈTRES DU SYSTÈME",
    "settings.appearance": "// APPARENCE ET THÈME",
    "settings.language": "// LANGUE",
    "settings.account": "// COMPTE",
    "settings.active": "ACTIF",
    "settings.currentLanguage": "Langue Actuelle",
    "settings.languageDescription": "La préférence de langue de l'interface est enregistrée localement.",
    "settings.signOut": "DÉCONNEXION",
    "settings.signedInAs": "Connecté en tant que",
    "settings.themeNote": "La préférence de thème est enregistrée localement et appliquée lors de la prochaine visite.",
    
    // Auth
    "auth.signIn": "CONNEXION",
    "auth.signUp": "CRÉER UN COMPTE",
    "auth.email": "EMAIL",
    "auth.password": "MOT DE PASSE",
    "auth.username": "NOM D'UTILISATEUR",
    "auth.rememberMe": "SE SOUVENIR DE MOI",
    "auth.forgotPassword": "Mot de passe oublié?",
    "auth.noAccount": "PAS DE COMPTE?",
    "auth.hasAccount": "Déjà un compte?",
    "auth.createAccount": "Créer un compte",
    "auth.createAccountLink": "CRÉER UN PROFIL OPÉRATEUR",
    "auth.login": "Connexion",
    "auth.terminalTitle": "TERMINAL D'ACCÈS SÉCURISÉ",
    "auth.operatorAuth": "AUTHENTIFICATION OPÉRATEUR",
    "auth.emailLabel": "ADRESSE EMAIL",
    "auth.emailPlaceholder": "operateur@necrom.sys",
    "auth.passwordLabel": "MOT DE PASSE",
    "auth.passwordPlaceholder": "••••••••••••",
    "auth.authenticating": "AUTHENTIFICATION...",
    "auth.accessSystem": "ACCÉDER AU SYSTÈME",
    "auth.encryptionNote": "TOUTES LES CONNEXIONS CHIFFRÉES // AES-256",
    "auth.register": "S'INSCRIRE",
    
    // Notifications
    "notifications.title": "NOTIFICATIONS",
    "notifications.clearAll": "Tout Effacer",
    "notifications.markAllRead": "Tout marquer comme lu",
    "notifications.empty": "Aucune notification",
    "notifications.virusDetected": "VIRUS DÉTECTÉ",
    "notifications.threatBlocked": "Menace bloquée par {protection}",
    "notifications.systemClean": "Nettoyage système terminé",
    "notifications.backupComplete": "Sauvegarde terminée",
    "notifications.daysSinceClean": "{days} jours depuis le dernier nettoyage",
    "notifications.cleanNow": "Nettoyer Maintenant",
    
    // Footer
    "footer.tagline": "NECROM CLOUD // TOUTES LES DONNÉES CHIFFRÉES // PROTOCOLE WATCH_DOGS ACTIF",
    "footer.build": "SYS_BUILD: 2026.02.27 — NŒUD: ctOS-7",
    
    // Common
    "common.save": "SAUVEGARDER",
    "common.cancel": "ANNULER",
    "common.delete": "SUPPRIMER",
    "common.restore": "RESTAURER",
    "common.close": "FERMER",
    "common.yes": "OUI",
    "common.no": "NON",
    "common.on": "ON",
    "common.off": "OFF",
    "common.enabled": "ACTIVÉ",
    "common.disabled": "DÉSACTIVÉ",
  },
  de: {
    // Navigation
    "nav.settings": "EINSTELLUNGEN",
    "nav.signIn": "ANMELDEN",
    "nav.signOut": "ABMELDEN",
    "nav.register": "REGISTRIEREN",
    
    // Home
    "home.title": "NECROM",
    "home.subtitle": "// SICHERE DIGITALE INFRASTRUKTUR",
    "home.description": "Verschlüsselter Cloud-Speicher mit militärischer Sicherheit. Speichern, verwalten und greifen Sie von überall auf Ihre Dateien, Videos, Audios und Daten zu. Jedes Byte ist geschützt.",
    "home.encryption": "VERSCHLÜSSELUNG",
    "home.uptime": "VERFÜGBARKEIT",
    "home.storage": "SPEICHER",
    "home.breaches": "VERLETZUNGEN",
    
    // Security
    "security.title": "SICHERHEITSFUNKTIONEN",
    "security.subtitle": "// AKTIVE SCHUTZSYSTEME",
    "security.allEnabled": "ALLE SYSTEME AKTIV",
    "security.someEnabled": "SYSTEME TEILWEISE AKTIV",
    "security.allDisabled": "SYSTEME OFFLINE",
    "security.enableAll": "ALLE AKTIVIEREN",
    "security.viewDetails": "DETAILS ANZEIGEN",
    "security.threatsBlocked": "BEDROHUNGEN BLOCKIERT",
    "security.lastScan": "LETZTER SCAN",
    "security.never": "Nie",
    "security.antivirus": "ANTIVIRUS",
    "security.vpn": "PRIVATES VPN",
    "security.firewall": "FIREWALL",
    "security.encryption": "END-TO-END",
    "security.watchdogs": "WÄCHTER",
    "security.audit": "PRÜFPROTOKOLL",
    "security.description.antivirus": "Echtzeit-Bedrohungserkennung & -entfernung",
    "security.description.vpn": "Verschlüsselter Tunnel für alle Verbindungen",
    "security.description.firewall": "Erweiterte Paketfilterung & Überwachung",
    "security.description.encryption": "Militärgrad-AES-256-Verschlüsselung",
    "security.description.watchdogs": "24/7 Einbruchserkennungssystem",
    "security.description.audit": "Vollständige Aktivitätsverfolgung & Forensik",
    
    // Storage
    "storage.title": "BACKUP-SERVER",
    "storage.used": "Benutzt",
    "storage.free": "Frei",
    "storage.total": "Gesamtspeicher",
    "storage.ssd": "NVMe SSD",
    
    // File Manager
    "files.title": "DATEISYSTEM",
    "files.upload": "HOCHLADEN",
    "files.newFolder": "NEUER ORDNER",
    "files.search": "Dateien suchen...",
    "files.allTypes": "Alle Typen",
    "files.images": "Bilder",
    "files.videos": "Videos",
    "files.audio": "Audio",
    "files.documents": "Dokumente",
    "files.archives": "Archive",
    "files.noFiles": "Keine Dateien gefunden",
    "files.dropFiles": "Dateien hier ablegen zum Hochladen",
    
    // Settings
    "settings.title": "SYSTEMEINSTELLUNGEN",
    "settings.appearance": "// ERSCHEINUNGSBILD & THEMA",
    "settings.language": "// SPRACHE",
    "settings.account": "// KONTO",
    "settings.active": "AKTIV",
    "settings.currentLanguage": "Aktuelle Sprache",
    "settings.languageDescription": "Die Spracheinstellung der Benutzeroberfläche wird lokal gespeichert.",
    "settings.signOut": "ABMELDEN",
    "settings.signedInAs": "Angemeldet als",
    "settings.themeNote": "Die Theme-Einstellung wird lokal gespeichert und beim nächsten Besuch angewendet.",
    
    // Auth
    "auth.signIn": "ANMELDEN",
    "auth.signUp": "KONTO ERSTELLEN",
    "auth.email": "EMAIL",
    "auth.password": "PASSWORT",
    "auth.username": "BENUTZERNAME",
    "auth.rememberMe": "ERINNERE DICH AN MICH",
    "auth.forgotPassword": "Passwort vergessen?",
    "auth.noAccount": "KEIN KONTO?",
    "auth.hasAccount": "Bereits ein Konto?",
    "auth.createAccount": "Konto erstellen",
    "auth.createAccountLink": "BETREIBERPROFIL ERSTELLEN",
    "auth.login": "Anmelden",
    "auth.terminalTitle": "SICHERER ZUGANGS-TERMINAL",
    "auth.operatorAuth": "BETREIBER-AUTHENTIFIZIERUNG",
    "auth.emailLabel": "EMAIL-ADRESSE",
    "auth.emailPlaceholder": "betreiber@necrom.sys",
    "auth.passwordLabel": "PASSWORT",
    "auth.passwordPlaceholder": "••••••••••••",
    "auth.authenticating": "AUTHENTIFIZIERUNG...",
    "auth.accessSystem": "SYSTEM ZUGREIFEN",
    "auth.encryptionNote": "ALLE VERBINDUNGEN VERSCHLÜSSELT // AES-256",
    "auth.register": "REGISTRIEREN",
    
    // Notifications
    "notifications.title": "BENACHRICHTIGUNGEN",
    "notifications.clearAll": "Alle Löschen",
    "notifications.markAllRead": "Alle als gelesen markieren",
    "notifications.empty": "Keine Benachrichtigungen",
    "notifications.virusDetected": "VIRUS ERKANNT",
    "notifications.threatBlocked": "Bedrohung blockiert durch {protection}",
    "notifications.systemClean": "Systemreinigung abgeschlossen",
    "notifications.backupComplete": "Backup abgeschlossen",
    "notifications.daysSinceClean": "{days} Tage seit letzter Reinigung",
    "notifications.cleanNow": "Jetzt Reinigen",
    
    // Footer
    "footer.tagline": "NECROM CLOUD // ALLE DATEN VERSCHLÜSSELT // WATCH_DOGS PROTOKOLL AKTIV",
    "footer.build": "SYS_BUILD: 2026.02.27 — KNOTEN: ctOS-7",
    
    // Common
    "common.save": "SPEICHERN",
    "common.cancel": "ABBRECHEN",
    "common.delete": "LÖSCHEN",
    "common.restore": "WIEDERHERSTELLEN",
    "common.close": "SCHLIESSEN",
    "common.yes": "JA",
    "common.no": "NEIN",
    "common.on": "ON",
    "common.off": "OFF",
    "common.enabled": "AKTIVIERT",
    "common.disabled": "DEAKTIVIERT",
  },
  zh: {
    // Navigation
    "nav.settings": "设置",
    "nav.signIn": "登录",
    "nav.signOut": "登出",
    "nav.register": "注册",
    
    // Home
    "home.title": "NECROM",
    "home.subtitle": "// 安全数字基础设施",
    "home.description": "军用级加密云存储。随时随地存储、管理和访问您的文件、视频、音频和数据。每个字节都受到保护。",
    "home.encryption": "加密",
    "home.uptime": "正常运行时间",
    "home.storage": "存储",
    "home.breaches": "入侵",
    
    // Security
    "security.title": "安全功能",
    "security.subtitle": "// 主动保护系统",
    "security.allEnabled": "所有系统已激活",
    "security.someEnabled": "系统部分激活",
    "security.allDisabled": "系统离线",
    "security.enableAll": "全部启用",
    "security.viewDetails": "查看详情",
    "security.threatsBlocked": "已阻止威胁",
    "security.lastScan": "上次扫描",
    "security.never": "从未",
    "security.antivirus": "防病毒",
    "security.vpn": "隐私VPN",
    "security.firewall": "防火墙",
    "security.encryption": "端到端加密",
    "security.watchdogs": "看门狗",
    "security.audit": "审计日志",
    "security.description.antivirus": "实时威胁检测与清除",
    "security.description.vpn": "所有连接的加密隧道",
    "security.description.firewall": "高级数据包过滤与监控",
    "security.description.encryption": "军用级AES-256加密",
    "security.description.watchdogs": "24/7入侵检测系统",
    "security.description.audit": "完整的活动跟踪与取证",
    
    // Storage
    "storage.title": "备份服务器",
    "storage.used": "已使用",
    "storage.free": "可用",
    "storage.total": "总存储",
    "storage.ssd": "NVMe SSD",
    
    // File Manager
    "files.title": "文件系统",
    "files.upload": "上传",
    "files.newFolder": "新建文件夹",
    "files.search": "搜索文件...",
    "files.allTypes": "所有类型",
    "files.images": "图片",
    "files.videos": "视频",
    "files.audio": "音频",
    "files.documents": "文档",
    "files.archives": "压缩包",
    "files.noFiles": "未找到文件",
    "files.dropFiles": "将文件拖放到此处上传",
    
    // Settings
    "settings.title": "系统设置",
    "settings.appearance": "// 外观与主题",
    "settings.language": "// 语言",
    "settings.account": "// 账户",
    "settings.active": "激活",
    "settings.currentLanguage": "当前语言",
    "settings.languageDescription": "界面语言首选项保存在本地。",
    "settings.signOut": "登出",
    "settings.signedInAs": "登录身份",
    "settings.themeNote": "主题首选项保存在本地，下次访问时应用。",
    
    // Auth
    "auth.signIn": "登录",
    "auth.signUp": "创建账户",
    "auth.email": "邮箱",
    "auth.password": "密码",
    "auth.username": "用户名",
    "auth.rememberMe": "记住我",
    "auth.forgotPassword": "忘记密码？",
    "auth.noAccount": "没有账户？",
    "auth.hasAccount": "已有账户？",
    "auth.createAccount": "创建账户",
    "auth.createAccountLink": "创建操作员档案",
    "auth.login": "登录",
    "auth.terminalTitle": "安全访问终端",
    "auth.operatorAuth": "操作员认证",
    "auth.emailLabel": "邮箱地址",
    "auth.emailPlaceholder": "operator@necrom.sys",
    "auth.passwordLabel": "密码",
    "auth.passwordPlaceholder": "••••••••••••",
    "auth.authenticating": "认证中...",
    "auth.accessSystem": "访问系统",
    "auth.encryptionNote": "所有连接已加密 // AES-256",
    "auth.register": "注册",
    
    // Notifications
    "notifications.title": "通知",
    "notifications.clearAll": "全部清除",
    "notifications.markAllRead": "全部标记为已读",
    "notifications.empty": "没有通知",
    "notifications.virusDetected": "检测到病毒",
    "notifications.threatBlocked": "{protection} 阻止了威胁",
    "notifications.systemClean": "系统清理完成",
    "notifications.backupComplete": "备份完成",
    "notifications.daysSinceClean": "上次清理已过去 {days} 天",
    "notifications.cleanNow": "立即清理",
    
    // Footer
    "footer.tagline": "NECROM 云 // 所有数据已加密 // WATCH_DOGS 协议激活",
    "footer.build": "系统构建: 2026.02.27 — 节点: ctOS-7",
    
    // Common
    "common.save": "保存",
    "common.cancel": "取消",
    "common.delete": "删除",
    "common.restore": "恢复",
    "common.close": "关闭",
    "common.yes": "是",
    "common.no": "否",
    "common.on": "开",
    "common.off": "关",
    "common.enabled": "已启用",
    "common.disabled": "已禁用",
  },
  ja: {
    // Navigation
    "nav.settings": "設定",
    "nav.signIn": "ログイン",
    "nav.signOut": "ログアウト",
    "nav.register": "登録",
    
    // Home
    "home.title": "NECROM",
    "home.subtitle": "// セキュアデジタルインフラ",
    "home.description": "軍事レベルの暗号化を備えたクラウドストレージ。どこからでもファイル、動画、音声、データを保存、管理、アクセス。すべてのバイトが保護されています。",
    "home.encryption": "暗号化",
    "home.uptime": "稼働時間",
    "home.storage": "ストレージ",
    "home.breaches": "侵害",
    
    // Security
    "security.title": "セキュリティ機能",
    "security.subtitle": "// アクティブ保護システム",
    "security.allEnabled": "すべてのシステムがアクティブ",
    "security.someEnabled": "システムが部分的にアクティブ",
    "security.allDisabled": "システムがオフライン",
    "security.enableAll": "すべて有効化",
    "security.viewDetails": "詳細を表示",
    "security.threatsBlocked": "ブロックされた脅威",
    "security.lastScan": "最後のスキャン",
    "security.never": "未スキャン",
    "security.antivirus": "アンチウイルス",
    "security.vpn": "プライバシーVPN",
    "security.firewall": "ファイアウォール",
    "security.encryption": "エンドツーエンド暗号化",
    "security.watchdogs": "ウォッチドッグ",
    "security.audit": "監査ログ",
    "security.description.antivirus": "リアルタイム脅威検出と除去",
    "security.description.vpn": "すべての接続の暗号化トンネル",
    "security.description.firewall": "高度なパケットフィルタリングと監視",
    "security.description.encryption": "軍事グレードAES-256暗号化",
    "security.description.watchdogs": "24時間365日の侵入検出システム",
    "security.description.audit": "完全なアクティビティ追跡とフォレンジック",
    
    // Storage
    "storage.title": "バックアップサーバー",
    "storage.used": "使用中",
    "storage.free": "空き",
    "storage.total": "総ストレージ",
    "storage.ssd": "NVMe SSD",
    
    // File Manager
    "files.title": "ファイルシステム",
    "files.upload": "アップロード",
    "files.newFolder": "新規フォルダ",
    "files.search": "ファイルを検索...",
    "files.allTypes": "すべてのタイプ",
    "files.images": "画像",
    "files.videos": "動画",
    "files.audio": "音声",
    "files.documents": "ドキュメント",
    "files.archives": "アーカイブ",
    "files.noFiles": "ファイルが見つかりません",
    "files.dropFiles": "ここにファイルをドロップしてアップロード",
    
    // Settings
    "settings.title": "システム設定",
    "settings.appearance": "// 外観とテーマ",
    "settings.language": "// 言語",
    "settings.account": "// アカウント",
    "settings.active": "アクティブ",
    "settings.currentLanguage": "現在の言語",
    "settings.languageDescription": "インターフェース言語設定はローカルに保存されます。",
    "settings.signOut": "ログアウト",
    "settings.signedInAs": "ログイン中",
    "settings.themeNote": "テーマ設定はローカルに保存され、次回の訪問時に適用されます。",
    
    // Auth
    "auth.signIn": "ログイン",
    "auth.signUp": "アカウント作成",
    "auth.email": "メール",
    "auth.password": "パスワード",
    "auth.username": "ユーザー名",
    "auth.rememberMe": "ログインを記憶",
    "auth.forgotPassword": "パスワードを忘れましたか？",
    "auth.noAccount": "アカウントをお持ちでないですか？",
    "auth.hasAccount": "すでにアカウントをお持ちですか？",
    "auth.createAccount": "アカウントを作成",
    "auth.createAccountLink": "オペレータープロファイルを作成",
    "auth.login": "ログイン",
    "auth.terminalTitle": "セキュアアクセス端末",
    "auth.operatorAuth": "オペレーター認証",
    "auth.emailLabel": "メールアドレス",
    "auth.emailPlaceholder": "operator@necrom.sys",
    "auth.passwordLabel": "パスワード",
    "auth.passwordPlaceholder": "••••••••••••",
    "auth.authenticating": "認証中...",
    "auth.accessSystem": "システムにアクセス",
    "auth.encryptionNote": "すべての接続が暗号化されています // AES-256",
    "auth.register": "登録",
    
    // Notifications
    "notifications.title": "通知",
    "notifications.clearAll": "すべてクリア",
    "notifications.markAllRead": "すべて既読にする",
    "notifications.empty": "通知はありません",
    "notifications.virusDetected": "ウイルス検出",
    "notifications.threatBlocked": "{protection} が脅威をブロックしました",
    "notifications.systemClean": "システムクリーン完了",
    "notifications.backupComplete": "バックアップ完了",
    "notifications.daysSinceClean": "最後のクリーンから {days} 日",
    "notifications.cleanNow": "今すぐクリーン",
    
    // Footer
    "footer.tagline": "NECROM クラウド // すべてのデータが暗号化 // WATCH_DOGS プロトコル有効",
    "footer.build": "システムビルド: 2026.02.27 — ノード: ctOS-7",
    
    // Common
    "common.save": "保存",
    "common.cancel": "キャンセル",
    "common.delete": "削除",
    "common.restore": "復元",
    "common.close": "閉じる",
    "common.yes": "はい",
    "common.no": "いいえ",
    "common.on": "オン",
    "common.off": "オフ",
    "common.enabled": "有効",
    "common.disabled": "無効",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  languages: LanguageOption[];
}

const I18nContext = createContext<I18nContextType | null>(null);

const LANGUAGE_KEY = "necrom_language";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_KEY) as Language | null;
      if (stored && translations[stored]) {
        startTransition(() => {
          setLanguageState(stored);
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const translation = translations[language][key] || translations["en"][key] || key;
      
      if (params) {
        return Object.entries(params).reduce(
          (acc, [k, v]) => acc.replace(new RegExp(`{${k}}`, "g"), String(v)),
          translation
        );
      }
      
      return translation;
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
