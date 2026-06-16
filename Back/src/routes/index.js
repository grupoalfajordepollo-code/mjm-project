import { Router } from 'express';
import categoriaRoutes from './categoriaRoutes.js';

const router = Router();

// Ruta de prueba para verificar que el servidor funciona
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor funcionando correctamente'
  });
});

// Rutas de Categorías
router.use('/categorias', categoriaRoutes);

export default router;