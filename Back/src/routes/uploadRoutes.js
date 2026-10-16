import { Router } from 'express';
import { uploadImages } from '../middlewares/uploadMiddleware.js';
import { uploadImage as uploadImageController } from '../controllers/uploadController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = Router();

// Este archivo SOLO define las rutas HTTP y encadena middleware con controller
// POST /upload (o /upload/imagen)
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  uploadImages,
  uploadImageController
);


export default router;
