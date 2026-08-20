import Categoria from "../models/Categoria.js";

// Obtener todas las categorias
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();

    res.status(200).json(categorias);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las categorias",
      error: error.message
    });
  }
};

// Obtener categoria por ID
export const obtenerCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoria no encontrada"
      });
    }

    res.json(categoria);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Crear categoria
export const crearCategoria = async (req, res) => {
  try {
    const {
      nombre,
      descripcion
    } = req.body;

    const categoria = await Categoria.create({
      nombre,
      descripcion
    });

    res.status(201).json(categoria);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Actualizar categoria
export const actualizarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoria no encontrada"
      });
    }

    await categoria.update(req.body);

    res.json(categoria);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Eliminar categoria
export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoria no encontrada"
      });
    }

    await categoria.destroy();

    res.json({
      mensaje: "Categoria eliminada"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

