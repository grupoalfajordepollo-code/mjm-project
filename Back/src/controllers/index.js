// Index de controladores (para middlewares y protecciones)

import {login } from "./authController.js";
import { crearUsuario, eliminarUsuario, obtenerUsuario, obtenerUsuarios, actualizarUsuario } from "./usuarioController.js";

export {
  login,
  crearUsuario,
  eliminarUsuario,
  obtenerUsuario,
  obtenerUsuarios,
  actualizarUsuario
};