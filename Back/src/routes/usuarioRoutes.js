import { Router } from 'express';
import {
    obtenerUsuario,
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} from '../controllers/usuarioController.js';

const router = Router();

// GET /api/usuarios
router.get('/', obtenerUsuarios);

// GET /api/usuarios/1
router.get('/:id', obtenerUsuario);

// POST /api/usuarios
router.post('/', crearUsuario);

// PUT /api/usuarios/1
router.put('/:id', actualizarUsuario);

// DELETE /api/usuarios/1
router.delete('/:id', eliminarUsuario);

export default router;
