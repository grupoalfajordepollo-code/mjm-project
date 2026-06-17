import ItemxCarrito from "../models/ItemxCarrito.js";
import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";

// Obtener todos
export const obtenerItems = async (req, res) => {
  try {

    const items = await ItemxCarrito.findAll({
      include: [
        {
          model: Carrito,
          as: "carrito",
          attributes: ["id"]
        },
        {
          model: Producto,
          as: "producto",
          attributes: ["id", "nombre", "precio"]
        }
      ]
    });

    res.json(items);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Obtener uno
export const obtenerItem = async (req, res) => {
  try {

    const item = await ItemxCarrito.findByPk(req.params.id, {
      include: [
        {
          model: Carrito,
          as: "carrito",
          attributes: ["id"]
        },
        {
          model: Producto,
          as: "producto",
          attributes: ["id", "nombre", "precio"]
        }
      ]
    });

    if (!item) {
      return res.status(404).json({
        mensaje: "Item no encontrado"
      });
    }

    res.json(item);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Crear
export const crearItem = async (req, res) => {

  try {

    const carrito = await Carrito.findByPk(req.body.idCarrito);

    if (!carrito) {
      return res.status(404).json({
        mensaje: "El carrito no existe"
      });
    }

    const producto = await Producto.findByPk(req.body.idProducto);

    if (!producto) {
      return res.status(404).json({
        mensaje: "El producto no existe"
      });
    }

    const item = await ItemxCarrito.create(req.body);

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }

};

// Actualizar
export const actualizarItem = async (req, res) => {

  try {

    const item = await ItemxCarrito.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        mensaje: "Item no encontrado"
      });
    }

    await item.update(req.body);

    res.json(item);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }

};

// Eliminar
export const eliminarItem = async (req, res) => {

  try {

    const item = await ItemxCarrito.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        mensaje: "Item no encontrado"
      });
    }

    await item.destroy();

    res.json({
      mensaje: "Item eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }

};

