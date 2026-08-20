import { Router } from "express";

import {
  obtenerAdministradores,
  obtenerAdministrador,
  crearAdministrador,
  actualizarAdministrador,
  eliminarAdministrador,
} from "../controllers/administradorController.js";

const router = Router();

router.get("/", obtenerAdministradores);
router.get("/:id", obtenerAdministrador);
router.post("/", crearAdministrador);
router.put("/:id", actualizarAdministrador);
router.delete("/:id", eliminarAdministrador);

export default router;

