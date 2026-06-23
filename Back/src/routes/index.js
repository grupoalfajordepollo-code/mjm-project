import { Router } from 'express';

import usuarioRoutes from './usuarioRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import productoRoutes from './productoRoutes.js';
import pedidoRoutes from './pedidoRoutes.js';
import carritoRoutes from "./carritoRoutes.js";

const router = Router();

// Ruta de prueba
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor funcionando correctamente'
  });
});

// Usuarios
router.use('/usuarios', usuarioRoutes);

// Categorías
router.use('/categorias', categoriaRoutes);

// Productos
router.use('/productos', productoRoutes);

// Pedidos
router.use('/pedidos', pedidoRoutes);

// Carritos
router.use("/carritos", carritoRoutes);

export default router;

