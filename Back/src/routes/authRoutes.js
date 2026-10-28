import { Router } from "express";
import { login } from "../controllers/index.js";
import { loginRateLimit } from "../middlewares/loginRateLimit.js";

import {
  solicitarRecuperacion,
  restablecerPassword
} from "../controllers/recuperacionController.js";

import { recuperacionRateLimit } from "../middlewares/recuperacionRateLimit.js";

const router = Router();

// Inicio de sesión
router.post("/login", loginRateLimit, login);

// Solicitar recuperación de contraseña
router.post(
  "/recuperar-password",
  recuperacionRateLimit,
  solicitarRecuperacion
);

// Restablecer contraseña mediante token
router.post("/restablecer-password", restablecerPassword);

export default router;

