import { ItemxPedido } from "../models/index.js";

// Obtener todos los items de pedido
export const obtenerItemsPedido = async (req, res) => {
  try {
    const items = await ItemxPedido.findAll();

    res.json(items);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Obtener item por ID
export const obtenerItemPedido = async (req, res) => {
  try {
    const item = await ItemxPedido.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        mensaje: "Item de pedido no encontrado",
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Crear item
export const crearItemPedido = async (req, res) => {
  try {
    const {
      idPedido,
      idProducto,
      cantidad,
      precioUnitario,
      subtotal,
    } = req.body;

    const item = await ItemxPedido.create({
      idPedido,
      idProducto,
      cantidad,
      precioUnitario,
      subtotal,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Modificar item
export const actualizarItemPedido = async (req, res) => {
  try {
    const item = await ItemxPedido.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        mensaje: "Item de pedido no encontrado",
      });
    }

    await item.update(req.body);

    res.json(item);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

// Eliminar item
export const eliminarItemPedido = async (req, res) => {
  try {
    const item = await ItemxPedido.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        mensaje: "Item de pedido no encontrado",
      });
    }

    await item.destroy();

    res.json({
      mensaje: "Item de pedido eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

