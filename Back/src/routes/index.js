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
import { UPLOADS_DIR } from "../config/multer.config.js";
import express from 'express';

import { sendWelcomeEmail } from '../services/emailService.js';

const router = Router();

// Ruta de prueba
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor funcionando correctamente'
  });
});

//Ruta de prueba de nodemailer
router.get('/mail-test', async (req, res) => {
  try {
    await sendWelcomeEmail('tu_email@ejemplo.com', 'Test User');
    res.send('✅ Correo de prueba enviado (revisá tu bandeja / spam)');
  } catch (error) {
    res.status(500).send('❌ Error enviando correo');
  }
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
router.use("/upload", uploadRoutes);

//Servir archivos estáticos
router.use('/archivos', express.static(UPLOADS_DIR));

export default router;

