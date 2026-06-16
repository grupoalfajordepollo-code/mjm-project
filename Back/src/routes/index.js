import { Router } from 'express';
import usuarioRoutes from './usuarioRoutes.js'
import categoriaRoutes from './categoriaRoutes.js';
import productoRoutes from './productoRoutes.js';


const router = Router();

// Ruta de prueba para verificar que el servidor funciona
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor funcionando correctamente'
  });
});

//Rutas de usuario
router.use('/usuarios', usuarioRoutes);

export default router;
// Rutas de Categorías
router.use('/categorias', categoriaRoutes);
router.use('/productos', productoRoutes);

export default router;
