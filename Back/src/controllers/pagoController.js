import Pago from "../models/Pago.js";
import Pedido from "../models/Pedido.js";

// Obtener todos los pagos
export const obtenerPagos = async (req, res) => {
  try {

    const pagos = await Pago.findAll({
      include: {
        model: Pedido,
        as: "pedido"
      }
    });

    res.json(pagos);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

// Obtener pago por ID
export const obtenerPago = async (req, res) => {
  try {

    const pago = await Pago.findByPk(req.params.id, {
      include: {
        model: Pedido,
        as: "pedido"
      }
    });

    if (!pago) {
      return res.status(404).json({
        mensaje: "Pago no encontrado"
      });
    }

    res.json(pago);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

// Crear pago
export const crearPago = async (req, res) => {
  try {

    const pedido = await Pedido.findByPk(req.body.idPedido);

    if (!pedido) {
      return res.status(404).json({
        mensaje: "El pedido no existe"
      });
    }

    const pago = await Pago.create(req.body);

    res.status(201).json(pago);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

// Actualizar pago
export const actualizarPago = async (req, res) => {
  try {

    const pago = await Pago.findByPk(req.params.id);

    if (!pago) {
      return res.status(404).json({
        mensaje: "Pago no encontrado"
      });
    }

    if (req.body.idPedido) {

      const pedido = await Pedido.findByPk(req.body.idPedido);

      if (!pedido) {
        return res.status(404).json({
          mensaje: "El pedido no existe"
        });
      }

    }

    await pago.update(req.body);

    res.json(pago);

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

// Eliminar pago
export const eliminarPago = async (req, res) => {
  try {

    const pago = await Pago.findByPk(req.params.id);

    if (!pago) {
      return res.status(404).json({
        mensaje: "Pago no encontrado"
      });
    }

    await pago.destroy();

    res.json({
      mensaje: "Pago eliminado correctamente"
    });

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
};

