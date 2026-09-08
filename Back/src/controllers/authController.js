import Administrador from "../models/Administrador.js";
import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

// Generar token JWT
const generarJWT = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "2h" });
};

// Login unificado - detecta el rol automáticamente
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar admin primero
    const admin = await Administrador.findOne({ where: { email } });
    if (admin) {
      const esPasswordValido = await admin.comprobarPassword(password);
      if (!esPasswordValido) {
        return res.status(401).json({ mensaje: "Email o contraseña incorrectos" });
      }
      const token = generarJWT(admin.id, "admin");
      return res.json({
        token,
        rol: "admin",
        usuario: {
          id: admin.id,
          nombre: admin.nombre,
          apellido: admin.apellido,
          email: admin.email
        }
      });
    }

    // Si no es admin, buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensaje: "Email o contraseña incorrectos" });
    }

    const esPasswordValido = await usuario.comprobarPassword(password);
    if (!esPasswordValido) {
      return res.status(401).json({ mensaje: "Email o contraseña incorrectos" });
    }

    const token = generarJWT(usuario.id, "usuario");
    res.json({
      token,
      rol: "usuario",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

