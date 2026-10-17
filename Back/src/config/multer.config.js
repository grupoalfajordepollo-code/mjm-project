import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// __dirname no existe en ESM, hay que reconstruirlo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Este módulo SOLO define paths y configuración de almacenamiento
// No importa controllers, no importa rutas, no toca HTTP.

// Paths de almacenamiento
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');
const DOCUMENTS_DIR = path.join(UPLOADS_DIR, 'documents');

// Crea las carpetas si no existen (se ejecuta una vez al arrancar la app)
const ensureUploadDirs = () => {
  [UPLOADS_DIR, IMAGES_DIR, DOCUMENTS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Carpeta creada: ${dir}`);
    } else {
      console.log(`Carpeta ya existe: ${dir}`);
    }
  });
};

// ─── SRP: Storage define DÓNDE y CON QUÉ NOMBRE se guarda cada archivo ───
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, IMAGES_DIR);
    } else {
      cb(null, DOCUMENTS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

// ─── SRP: Filtros definen QUÉ TIPOS de archivo se aceptan ───
// Son funciones puras: reciben un archivo, devuelven true/false
const fileFilters = {
  image: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se admiten imágenes (JPG, PNG, GIF, WEBP, SVG)'), false);
    }
  },
  document: (req, file, cb) => {
    const allowedExts = ['.pdf', '.xls', '.xlsx', '.doc', '.docx', '.csv', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se admiten documentos (PDF, Excel, Word, CSV, TXT)'), false);
    }
  },
  general: (req, file, cb) => {
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
      '.pdf', '.xls', '.xlsx', '.doc', '.docx', '.csv', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error(`Formato no válido: ${file.originalname}`), false);
    }
  }
};

export {
  storage,
  fileFilters,
  ensureUploadDirs,
  UPLOADS_DIR,
  IMAGES_DIR,
  DOCUMENTS_DIR
};
