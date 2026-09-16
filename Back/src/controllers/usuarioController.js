import Usuario from "../models/Usuario.js";

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: {
        exclude: ["password"]
      }
    });

    res.status(200).json(usuarios);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los usuarios",
      error: error.message
    });
  }
};

// Obtener un usuario por ID
export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: {
        exclude: ["password"]
      }
    });

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    res.json(usuario);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Crear usuario
export const crearUsuario = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      password,
      telefono
    } = req.body;

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      telefono
    });

    const resultado = usuario.toJSON();
    delete resultado.password;

    res.status(201).json(resultado);

  } catch (error) {

    // Error de validación de Sequelize
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        mensaje:
          error.errors?.[0]?.message ||
          "Los datos ingresados no son válidos"
      });
    }

    // Email duplicado
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        mensaje: "El email ingresado ya se encuentra registrado"
      });
    }

    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    const {
      nombre,
      apellido,
      email,
      password,
      telefono
    } = req.body;

    await usuario.update({
      nombre,
      apellido,
      email,
      password,
      telefono
    });

    const resultado = usuario.toJSON();
    delete resultado.password;

    res.json(resultado);

  } catch (error) {

    // Error de validación de Sequelize
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        mensaje:
          error.errors?.[0]?.message ||
          "Los datos ingresados no son válidos"
      });
    }

    // Email duplicado
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        mensaje: "El email ingresado ya se encuentra registrado"
      });
    }

    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    await usuario.destroy();

    res.json({
      mensaje: "Usuario eliminado"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

