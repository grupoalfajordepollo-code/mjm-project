import { Router } from 'express';
import usuarioRoutes from './usuarioRoutes.js'

const router = Router();

// Ruta de prueba para verificar que el servidor funciona
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

//Rutas de usuario
router.use('/usuarios', usuarioRoutes);

export default router;
