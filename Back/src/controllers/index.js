// Index de controladores (para middlewares y protecciones)

import {login, loginAdmin } from "./authController.js";
import { crearUsuario, eliminarUsuario, obtenerUsuario, obtenerUsuarios, actualizarUsuario } from "./usuarioController.js";

export {
  login,
  loginAdmin,
  crearUsuario,
  eliminarUsuario,
  obtenerUsuario,
  obtenerUsuarios,
  actualizarUsuario
};