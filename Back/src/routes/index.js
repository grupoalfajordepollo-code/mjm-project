import { Router } from 'express';

import usuarioRoutes from './usuarioRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import productoRoutes from './productoRoutes.js';
import pedidoRoutes from './pedidoRoutes.js';
import itemxCarritoRoutes from "./itemxCarritoRoutes.js";

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

// Items del carrito
router.use("/items-carrito", itemxCarritoRoutes);

export default router;

