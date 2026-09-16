import jwt from "jsonwebtoken";
import { Usuario, Administrador } from "../models/index.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "No tienes permiso para acceder a este recurso."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;

    const entity = decoded.rol === "usuario"
      ? await Usuario.findByPk(decoded.id)
      : await Administrador.findByPk(decoded.id);

    if (!entity) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    if (decoded.rol === "usuario") {
      req.usuario = entity;
    } else {
      req.admin = entity;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido"
    });
  }
};