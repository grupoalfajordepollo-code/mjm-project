import multer from 'multer';
import { storage, fileFilters } from '../config/multer.config.js';

// ─── SRP: Este módulo SOLO crea las instancias ejecutables de Multer ───
// Su única razón para cambiar es si cambian las reglas de parsing o límites de tamaño.

// ─── Manejo de errores de Multer unificado en la capa de Middleware ───
// Captura errores de Multer antes de que lleguen al controller
export const handleMulterError = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        const messages = {
          LIMIT_FILE_COUNT: 'Se superó el límite máximo de 10 archivos simultáneos',
          LIMIT_FILE_SIZE: 'El archivo supera el tamaño máximo permitido',
          LIMIT_UNEXPECTED_FILE: `Campo no esperado en la petición: ${err.field}`
        };

        return res.status(400).json({
          success: false,
          error: messages[err.code] || `Error de subida: ${err.message}`
        });
      }

      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }

      next();
    });
  };
};
// Instancia para procesar únicamente imágenes (máx 10MB)
export const uploadImage = multer({
  storage,
  fileFilter: fileFilters.image,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});


// Instancia para procesar únicamente documentos (máx 25MB)
export const uploadDocument = multer({
  storage,
  fileFilter: fileFilters.document,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB
});



// Acepta entre 1 y 5 imágenes en el campo "imagenes"
export const uploadImages = handleMulterError(uploadImage.array('imagenes', 5));