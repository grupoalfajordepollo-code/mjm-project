import Pedido from "../models/Pedido.js";
import Usuario from "../models/Usuario.js";
import ItemxPedido from "../models/ItemxPedido.js";
import Producto from "../models/Producto.js";
import Pago from "../models/Pago.js";

// Obtener todos los pedidos
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre", "apellido", "email"]
        },
        {
          model: ItemxPedido,
          as: "items",
          include: [
            {
              model: Producto,
              as: "producto"
            }
          ]
        },
        {
          model: Pago,
          as: "pago"
        }
      ]
    });

    res.json(pedidos);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Obtener pedido por ID
export const obtenerPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre", "apellido", "email"]
        },
        {
          model: ItemxPedido,
          as: "items",
          include: [
            {
              model: Producto,
              as: "producto"
            }
          ]
        },
        {
          model: Pago,
          as: "pago"
        }
      ]
    });

    if (!pedido) {
      return res.status(404).json({
        mensaje: "Pedido no encontrado"
      });
    }

    res.json(pedido);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Crear pedido
export const crearPedido = async (req, res) => {
  try {
    const {
      idUsuario,
      fechaPedido,
      total,
      estado
    } = req.body;

    const usuario = await Usuario.findByPk(idUsuario);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "El usuario no existe"
      });
    }

    const pedido = await Pedido.create({
      idUsuario,
      fechaPedido,
      total,
      estado
    });

    res.status(201).json(pedido);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Actualizar pedido
export const actualizarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);

    if (!pedido) {
      return res.status(404).json({
        mensaje: "Pedido no encontrado"
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

    await pedido.update(req.body);

    res.json(pedido);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Eliminar pedido
export const eliminarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);

    if (!pedido) {
      return res.status(404).json({
        mensaje: "Pedido no encontrado"
      });
    }

    await pedido.destroy();

    res.json({
      mensaje: "Pedido eliminado"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

