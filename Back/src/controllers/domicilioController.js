import { Domicilio } from "../models/index.js";

// Obtener todos los domicilios
export const obtenerDomicilios = async (req, res) => {
  try {
    const domicilios = await Domicilio.findAll();

    res.json(domicilios);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Obtener domicilio por ID
export const obtenerDomicilio = async (req, res) => {
  try {
    const domicilio = await Domicilio.findByPk(req.params.id);

    if (!domicilio) {
      return res.status(404).json({
        mensaje: "Domicilio no encontrado",
      });
    }

    res.json(domicilio);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Crear domicilio
export const crearDomicilio = async (req, res) => {
  try {
    const {
      idUsuario,
      calle,
      numero,
      ciudad,
      provincia,
      codigoPostal,
      referencia,
      favorito,
    } = req.body;

    const domicilio = await Domicilio.create({
      idUsuario,
      calle,
      numero,
      ciudad,
      provincia,
      codigoPostal,
      referencia,
      favorito,
    });

    res.status(201).json(domicilio);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Modificar domicilio
export const actualizarDomicilio = async (req, res) => {
  try {
    const domicilio = await Domicilio.findByPk(req.params.id);

    if (!domicilio) {
      return res.status(404).json({
        mensaje: "Domicilio no encontrado",
      });
    }

    await domicilio.update(req.body);

    res.json(domicilio);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Eliminar domicilio
export const eliminarDomicilio = async (req, res) => {
  try {
    const domicilio = await Domicilio.findByPk(req.params.id);

    if (!domicilio) {
      return res.status(404).json({
        mensaje: "Domicilio no encontrado",
      });
    }

    await domicilio.destroy();

    res.json({
      mensaje: "Domicilio eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

