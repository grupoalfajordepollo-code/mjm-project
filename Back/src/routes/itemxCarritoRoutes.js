import { Router } from "express";

import {
  obtenerItems,
  obtenerItem,
  crearItem,
  actualizarItem,
  eliminarItem
} from "../controllers/itemxCarritoController.js";

const router = Router();

router.get("/", obtenerItems);
router.get("/:id", obtenerItem);
router.post("/", crearItem);
router.put("/:id", actualizarItem);
router.delete("/:id", eliminarItem);

export default router;

