import { Router } from "express";

import {
  obtenerItemsPedido,
  obtenerItemPedido,
  crearItemPedido,
  actualizarItemPedido,
  eliminarItemPedido,
} from "../controllers/itemxPedidoController.js";

const router = Router();

router.get("/", obtenerItemsPedido);
router.get("/:id", obtenerItemPedido);
router.post("/", crearItemPedido);
router.put("/:id", actualizarItemPedido);
router.delete("/:id", eliminarItemPedido);

export default router;

