import { Router } from "express";

import {
  obtenerDomicilios,
  obtenerDomicilio,
  obtenerDomiciliosPorUsuario,
  crearDomicilio,
  actualizarDomicilio,
  eliminarDomicilio,
} from "../controllers/domicilioController.js";

const router = Router();

// Obtener todos los domicilios
router.get("/", obtenerDomicilios);

// Obtener todos los domicilios de un usuario
// IMPORTANTE: esta ruta debe estar antes de "/:id"
router.get("/usuario/:idUsuario", obtenerDomiciliosPorUsuario);

// Obtener domicilio por ID
router.get("/:id", obtenerDomicilio);

// Crear domicilio
router.post("/", crearDomicilio);

// Modificar domicilio
router.put("/:id", actualizarDomicilio);

// Eliminar domicilio
router.delete("/:id", eliminarDomicilio);

export default router;

