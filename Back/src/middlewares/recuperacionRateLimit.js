import { rateLimit } from "express-rate-limit";

// Limitar las solicitudes de recuperación de contraseña.
// Máximo 5 solicitudes cada 15 minutos por dirección IP.
export const recuperacionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    mensaje: "Demasiadas solicitudes de recuperación. Reintentá en unos minutos."
  }
});


