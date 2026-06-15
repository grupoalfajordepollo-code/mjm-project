import { Router } from 'express';

const router = Router();

// Ruta de prueba para verificar que el servidor funciona
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

export default router;
