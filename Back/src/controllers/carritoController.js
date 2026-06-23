import Carrito from "../models/Carrito.js";
import Usuario from "../models/Usuario.js";

// Obtener todos los carritos
export const obtenerCarritos = async (req, res) => {
  try {

    const carritos = await Carrito.findAll({
      include: {
        model: Usuario,
        as: "usuario",
        attributes: ["id", "nombre", "apellido", "email"]
      }
    });

    res.json(carritos);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

// Obtener un carrito por ID
export const obtenerCarrito = async (req, res) => {

  try {

    const carrito = await Carrito.findByPk(req.params.id, {
      include: {
        model: Usuario,
        as: "usuario",
        attributes: ["id", "nombre", "apellido", "email"]
      }
    });

    if (!carrito) {
      return res.status(404).json({
        mensaje: "Carrito no encontrado"
      });
    }

    res.json(carrito);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }

};

// Crear carrito
export const crearCarrito = async (req, res) => {

  try {

    const usuario = await Usuario.findByPk(req.body.idUsuario);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "El usuario no existe"
      });
    }

    const carrito = await Carrito.create(req.body);

    res.status(201).json(carrito);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }

};

// Actualizar carrito
export const actualizarCarrito = async (req, res) => {

  try {

    const carrito = await Carrito.findByPk(req.params.id);

    if (!carrito) {
      return res.status(404).json({
        mensaje: "Carrito no encontrado"
      });
    }

    if (req.body.idUsuario) {

      const usuario = await Usuario.findByPk(req.body.idUsuario);

      if (!usuario) {
        return res.status(404).json({
          mensaje: "El usuario no existe"
        });
      }

    }

    await carrito.update(req.body);

    res.json(carrito);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }

};

// Eliminar carrito
export const eliminarCarrito = async (req, res) => {

  try {

    const carrito = await Carrito.findByPk(req.params.id);

    if (!carrito) {
      return res.status(404).json({
        mensaje: "Carrito no encontrado"
      });
    }

    await carrito.destroy();

    res.json({
      mensaje: "Carrito eliminado correctamente"
    });

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }

};

