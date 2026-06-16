import Categoria from "../models/Categoria.js";

// Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();

    res.status(200).json(categorias);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las categorías",
      error: error.message
    });
  }
};

// Obtener una categoría por ID
export const obtenerCategoria = async (req, res) => {
  try {

    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada"
      });
    }

    res.json(categoria);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Crear categoría
export const crearCategoria = async (req, res) => {

  try {

    const categoria = await Categoria.create(req.body);

    res.status(201).json(categoria);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }

};

// Actualizar categoría
export const actualizarCategoria = async (req, res) => {

  try {

    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada"
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

// Eliminar categoría
export const eliminarCategoria = async (req, res) => {

  try {

    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada"
      });
    }

    await categoria.destroy();

    res.json({
      mensaje: "Categoría eliminada correctamente"
    });

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }

};