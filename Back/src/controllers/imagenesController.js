import { Imagenes } from "../models/index.js";

// Obtener todas las imagenes
export const obtenerImagenes = async (req, res) => {
  try {
    const imagenes = await Imagenes.findAll();

    res.json(imagenes);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Obtener imagen por ID
export const obtenerImagen = async (req, res) => {
  try {
    const imagen = await Imagenes.findByPk(req.params.id);

    if (!imagen) {
      return res.status(404).json({
        mensaje: "Imagen no encontrada",
      });
    }

    res.json(imagen);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Crear imagen
export const crearImagen = async (req, res) => {
  try {
    const {
      imagen,
      descripcion,
    } = req.body;

    const nuevaImagen = await Imagenes.create({
      imagen,
      descripcion,
    });

    res.status(201).json(nuevaImagen);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Modificar imagen
export const actualizarImagen = async (req, res) => {
  try {
    const imagen = await Imagenes.findByPk(req.params.id);

    if (!imagen) {
      return res.status(404).json({
        mensaje: "Imagen no encontrada",
      });
    }

    const {
      imagen: nombreImagen,
      descripcion,
    } = req.body;

    await imagen.update({
      imagen: nombreImagen,
      descripcion,
    });

    res.json(imagen);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Eliminar imagen
export const eliminarImagen = async (req, res) => {
  try {
    const imagen = await Imagenes.findByPk(req.params.id);

    if (!imagen) {
      return res.status(404).json({
        mensaje: "Imagen no encontrada",
      });
    }

    await imagen.destroy();

    res.json({
      mensaje: "Imagen eliminada",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

