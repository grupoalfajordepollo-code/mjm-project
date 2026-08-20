import { Administrador } from "../models/index.js";

// Obtener todos los administradores
export const obtenerAdministradores = async (req, res) => {
  try {
    const administradores = await Administrador.findAll({
      attributes: { exclude: ["password"] },
    });

    res.json(administradores);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Obtener administrador por ID
export const obtenerAdministrador = async (req, res) => {
  try {
    const administrador = await Administrador.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!administrador) {
      return res.status(404).json({
        mensaje: "Administrador no encontrado",
      });
    }

    res.json(administrador);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Crear administrador
export const crearAdministrador = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      password,
    } = req.body;

    const administrador = await Administrador.create({
      nombre,
      apellido,
      email,
      password,
    });

    const resultado = administrador.toJSON();
    delete resultado.password;

    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Actualizar administrador
export const actualizarAdministrador = async (req, res) => {
  try {
    const administrador = await Administrador.findByPk(req.params.id);

    if (!administrador) {
      return res.status(404).json({
        mensaje: "Administrador no encontrado",
      });
    }

    await administrador.update(req.body);

    const resultado = administrador.toJSON();
    delete resultado.password;

    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Eliminar administrador
export const eliminarAdministrador = async (req, res) => {
  try {
    const administrador = await Administrador.findByPk(req.params.id);

    if (!administrador) {
      return res.status(404).json({
        mensaje: "Administrador no encontrado",
      });
    }

    await administrador.destroy();

    res.json({
      mensaje: "Administrador eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

