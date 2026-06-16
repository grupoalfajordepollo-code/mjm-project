import { Router } from 'express';

import {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../controllers/categoriaController.js';

const router = Router();

// GET /api/categorias
router.get('/', obtenerCategorias);

// GET /api/categorias/1
router.get('/:id', obtenerCategoria);

// POST /api/categorias
router.post('/', crearCategoria);

// PUT /api/categorias/1
router.put('/:id', actualizarCategoria);

// DELETE /api/categorias/1
router.delete('/:id', eliminarCategoria);

export default router;

