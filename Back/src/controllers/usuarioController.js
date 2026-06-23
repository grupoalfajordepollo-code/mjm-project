import Usuario from "../models/Usuario.js";

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();

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

    const usuario = await Usuario.findByPk(req.params.id);

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

// Crear Usuario
export const crearUsuario = async (req, res) => {

  try {

    const usuario = await Usuario.create(req.body);

    res.status(201).json(usuario);

  } catch (error) {

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

    await usuario.update(req.body);

    res.json(usuario);

  } catch (error) {

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
      mensaje: "Usuario eliminado correctamente"
    });

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }

};