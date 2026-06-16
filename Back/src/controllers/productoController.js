import Producto from "../models/Producto.js";
import Categoria from "../models/Categoria.js";

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: {
        model: Categoria,
        as: "categoria",
        attributes: ["id", "nombre"]
      }
    });

    res.json(productos);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Obtener un producto por ID
export const obtenerProducto = async (req, res) => {
  try {

    const producto = await Producto.findByPk(req.params.id, {
      include: {
        model: Categoria,
        as: "categoria",
        attributes: ["id", "nombre"]
      }
    });

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.json(producto);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

// Crear producto
export const crearProducto = async (req, res) => {
  try {

    // Verificar que la categoría exista
    const categoria = await Categoria.findByPk(req.body.idCategoria);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "La categoría no existe"
      });
    }

    const producto = await Producto.create(req.body);

    res.status(201).json(producto);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

// Actualizar producto
export const actualizarProducto = async (req, res) => {

  try {

    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    // Si envían una categoría nueva, verificar que exista
    if (req.body.idCategoria) {

      const categoria = await Categoria.findByPk(req.body.idCategoria);

      if (!categoria) {
        return res.status(404).json({
          mensaje: "La categoría no existe"
        });
      }
    }

    await producto.update(req.body);

    res.json(producto);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {

  try {

    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    await producto.destroy();

    res.json({
      mensaje: "Producto eliminado correctamente"
    });

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};


