import jwt from "jsonwebtoken";
import { Usuario, Administrador } from "../models/index.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Verificar si el token existe en el header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "No tienes permiso para acceder a este recurso."
      });
    }

    const token = authHeader.split(" ")[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;

    // Verificar si es usuario o admin
    const usuario = await Usuario.findByPk(decoded.id);
    const admin = await Administrador.findByPk(decoded.id);

    if (!usuario && !admin) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    if (usuario) {
      req.usuario = usuario;
    } else {
      req.admin = admin;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido"
    });
  }
};