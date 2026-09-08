import { Router } from "express";

import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productoController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/", obtenerProductos);

router.get("/:id", obtenerProducto);

router.post("/", authMiddleware, adminMiddleware, crearProducto);

router.put("/:id", authMiddleware, adminMiddleware, actualizarProducto);

router.delete("/:id", authMiddleware, adminMiddleware, eliminarProducto);

export default router;

