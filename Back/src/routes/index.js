import { Router } from 'express';

import usuarioRoutes from './usuarioRoutes.js';
import categoriaRoutes from './categoriaRoutes.js';
import productoRoutes from './productoRoutes.js';
import pedidoRoutes from './pedidoRoutes.js';
import carritoRoutes from './carritoRoutes.js';
import itemxCarritoRoutes from "./itemxCarritoRoutes.js";
import pagoRoutes from './pagoRoutes.js';
import authRoutes from "./authRoutes.js";
import domicilioRoutes from "./domicilioRoutes.js";
import imagenesRoutes from "./imagenesRoutes.js";
import itemxPedidoRoutes from "./itemxPedidoRoutes.js";
import administradorRoutes from "./administradorRoutes.js";
import uploadRoutes from "./uploadRoutes.js"

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
router.use('/carritos', carritoRoutes);

// Items del carrito
router.use("/items-carrito", itemxCarritoRoutes);

// Pagos
router.use('/pagos', pagoRoutes);

// Auth
router.use("/auth", authRoutes);

// Domicilios
router.use("/domicilios", domicilioRoutes);

// Imagenes
router.use("/imagenes", imagenesRoutes);

// ItemxPedidos
router.use("/items-pedido", itemxPedidoRoutes);

// Administrador
router.use("/administradores", administradorRoutes);

//Carga de Imagenes
router.use("/upload", uploadRoutes)

export default router;

