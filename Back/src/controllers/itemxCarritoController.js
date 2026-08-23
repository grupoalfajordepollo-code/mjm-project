import ItemxCarrito from "../models/ItemxCarrito.js";
import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";

// Obtener todos los items
export const obtenerItems = async (req, res) => {
  try {
    const items = await ItemxCarrito.findAll({
      include: [
        {
          model: Carrito,
          as: "carrito",
          attributes: ["id", "idUsuario"]
        },
        {
          model: Producto,
          as: "producto",
          attributes: ["id", "nombre", "precio", "stock", "idImagen"]
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

// Obtener item por ID
export const obtenerItem = async (req, res) => {
  try {
    const item = await ItemxCarrito.findByPk(req.params.id, {
      include: [
        {
          model: Carrito,
          as: "carrito",
          attributes: ["id", "idUsuario"]
        },
        {
          model: Producto,
          as: "producto",
          attributes: ["id", "nombre", "precio", "stock", "idImagen"]
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

// Crear item
export const crearItem = async (req, res) => {
  try {
    const {
      idCarrito,
      idProducto,
      cantidad
    } = req.body;

    const carrito = await Carrito.findByPk(idCarrito);

    if (!carrito) {
      return res.status(404).json({
        mensaje: "El carrito no existe"
      });
    }

    const producto = await Producto.findByPk(idProducto);

    if (!producto) {
      return res.status(404).json({
        mensaje: "El producto no existe"
      });
    }

    const precioUnitario = producto.precio;
    const subtotal = Number(precioUnitario) * Number(cantidad);

    const item = await ItemxCarrito.create({
      idCarrito,
      idProducto,
      cantidad,
      precioUnitario,
      subtotal
    });

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Actualizar item
export const actualizarItem = async (req, res) => {
  try {
    const item = await ItemxCarrito.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        mensaje: "Item no encontrado"
      });
    }

    const producto = await Producto.findByPk(
      req.body.idProducto || item.idProducto
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "El producto no existe"
      });
    }

    const cantidad = req.body.cantidad ?? item.cantidad;
    const precioUnitario = producto.precio;
    const subtotal = Number(precioUnitario) * Number(cantidad);

    await item.update({
      idCarrito: req.body.idCarrito ?? item.idCarrito,
      idProducto: req.body.idProducto ?? item.idProducto,
      cantidad,
      precioUnitario,
      subtotal
    });

    res.json(item);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Eliminar item
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
      mensaje: "Item eliminado"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

