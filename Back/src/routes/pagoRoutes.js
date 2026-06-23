import { Router } from "express";
import {
  obtenerPagos,
  obtenerPago,
  crearPago,
  actualizarPago,
  eliminarPago
} from "../controllers/pagoController.js";

const router = Router();

router.get("/", obtenerPagos);
router.get("/:id", obtenerPago);
router.post("/", crearPago);
router.put("/:id", actualizarPago);
router.delete("/:id", eliminarPago);

export default router;

