import Administrador from "../models/Administrador.js";
import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

// Generar token JWT
const generarJWT = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "2h" });
};

// Autenticar usuario
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Verificar usuario
    const usuario = await Usuario.findOne({
      where: {
        email
      }
    });

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Email o contraseña incorrectos"
      });
    }

    // Verificar contraseña
    const esPasswordValido = await usuario.comprobarPassword(password);

    if (!esPasswordValido) {
      return res.status(401).json({
        mensaje: "Email o contraseña incorrectos"
      });
    }

    // Generar token
    const token = generarJWT(usuario.id, "usuario");

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email
      }
    });

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

// Autenticar admin
export const loginAdmin = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Verificar admin
    const admin = await Administrador.findOne({
      where: {
        email
      }
    });

    if (!admin) {
      return res.status(401).json({
        mensaje: "Email o contraseña incorrectos"
      });
    }

    // Verificar contraseña
    const esPasswordValido = await admin.comprobarPassword(password);

    if (!esPasswordValido) {
      return res.status(401).json({
        mensaje: "Email o contraseña incorrectos"
      });
    }

    // Generar token
    const token = generarJWT(admin.id, "admin");

    res.json({
      token,
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        apellido: admin.apellido,
        email: admin.email
      }
    });

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

