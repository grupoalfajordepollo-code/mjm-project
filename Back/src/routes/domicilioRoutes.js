import { Router } from "express";

import {
  obtenerDomicilios,
  obtenerDomicilio,
  crearDomicilio,
  actualizarDomicilio,
  eliminarDomicilio,
} from "../controllers/domicilioController.js";

const router = Router();

router.get("/", obtenerDomicilios);
router.get("/:id", obtenerDomicilio);
router.post("/", crearDomicilio);
router.put("/:id", actualizarDomicilio);
router.delete("/:id", eliminarDomicilio);

export default router;

