import { Router } from "express";

import {
  obtenerPedidos,
  obtenerPedido,
  crearPedido,
  actualizarPedido,
  eliminarPedido
} from "../controllers/pedidoController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();

// Lectura global y escritura: solo admin. El detalle y la creación
// requieren sesión (el cliente verá solo sus pedidos cuando exista el checkout).
router.get("/", authMiddleware, adminMiddleware, obtenerPedidos);
router.get("/:id", authMiddleware, obtenerPedido);
router.post("/", authMiddleware, crearPedido);
router.put("/:id", authMiddleware, adminMiddleware, actualizarPedido);
router.delete("/:id", authMiddleware, adminMiddleware, eliminarPedido);

export default router;

