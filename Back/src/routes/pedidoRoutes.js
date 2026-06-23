import { Router } from "express";

import {
  obtenerPedidos,
  obtenerPedido,
  crearPedido,
  actualizarPedido,
  eliminarPedido
} from "../controllers/pedidoController.js";

const router = Router();

router.get("/", obtenerPedidos);
router.get("/:id", obtenerPedido);
router.post("/", crearPedido);
router.put("/:id", actualizarPedido);
router.delete("/:id", eliminarPedido);

export default router;

