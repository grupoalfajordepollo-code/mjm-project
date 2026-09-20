import { rateLimit } from "express-rate-limit";

// Freno a fuerza bruta sobre el login: 10 intentos cada 15 minutos por IP.
// Al exceder responde 429 + header Retry-After (el form admin lo lee para
// mostrar la cuenta regresiva). Solo se aplica a /auth/login; el resto de
// rutas no se toca.
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { mensaje: "Demasiados intentos. Reintentá en unos minutos." },
});
