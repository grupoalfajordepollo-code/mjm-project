import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

import {
  obtenerImagenes,
  obtenerImagen,
  crearImagen,
  actualizarImagen,
  eliminarImagen,
  marcarPortada
} from "../controllers/imagenesController.js";

const router = Router();

router.get("/", obtenerImagenes);
router.get("/:id", obtenerImagen);
router.post("/", authMiddleware, adminMiddleware, crearImagen);
router.put("/:id/portada", authMiddleware, adminMiddleware, marcarPortada)
router.put("/:id", authMiddleware, adminMiddleware, actualizarImagen);
router.delete("/:id", authMiddleware, adminMiddleware, eliminarImagen);

export default router;

