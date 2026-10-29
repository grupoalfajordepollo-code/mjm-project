import { Pedido, Usuario, ItemxPedido, Producto, Pago, Imagenes } from "../models/index.js";
import { notificarNuevoPedido, notificarCambioEstado } from "../services/pedidosEmailService.js"

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
              as: "producto",
              include: [
                {
                  model: Imagenes,
                  as: "imagenes"
                }
              ]
            }
          ]
        },
        {
          model: Pago,
          as: "pago"
        }
      ],
      order: [["id", "DESC"]]
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
              as: "producto",
              include: [
                {
                  model: Imagenes,
                  as: "imagenes"
                }
              ]
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

// Obtener pedidos por usuario
export const obtenerPedidosPorUsuario = async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario || req.usuarioId;

    if (req.usuario && req.usuario.id !== Number(idUsuario)) {
      return res.status(403).json({
        mensaje: "No tienes permiso para ver los pedidos de este usuario"
      });
    }

    const pedidos = await Pedido.findAll({
      where: {
        idUsuario
      },
      include: [
        {
          model: ItemxPedido,
          as: "items",
          include: [
            {
              model: Producto,
              as: "producto",
              include: [
                {
                  model: Imagenes,
                  as: "imagenes"
                }
              ]
            }
          ]
        },
        {
          model: Pago,
          as: "pago"
        }
      ],
      order: [["id", "DESC"]]
    });

    res.json(pedidos);

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
      estado,
      items,
      metodoPago
    } = req.body;

    const usuario = await Usuario.findByPk(idUsuario);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "El usuario no existe"
      });
    }

    const pedido = await Pedido.create({
      idUsuario,
      fechaPedido: fechaPedido || new Date(),
      total,
      estado: estado || "Pendiente"
    });

    if (Array.isArray(items) && items.length > 0) {
      for (const it of items) {
        const idProducto = it.idProducto || it.id;
        const cantidad = Number(it.cantidad) || 1;
        let precioUnitario = Number(it.precioUnitario ?? it.precio);

        if (!precioUnitario || isNaN(precioUnitario)) {
          const prodObj = await Producto.findByPk(idProducto);
          precioUnitario = prodObj ? Number(prodObj.precio) : 0;
        }

        const subtotal = Number(it.subtotal) || (precioUnitario * cantidad);

        await ItemxPedido.create({
          idPedido: pedido.id,
          idProducto,
          cantidad,
          precioUnitario,
          subtotal
        });
      }
    }

    if (metodoPago) {
      const nombreMetodo = String(metodoPago).toLowerCase() === "transferencia"
        ? "Transferencia Bancaria"
        : "MercadoPago";

      await Pago.create({
        idPedido: pedido.id,
        metodoPago: nombreMetodo,
        estadoPago: "Aprobado",
        fechaPago: new Date(),
        monto: total
      });
    }

    const pedidoCompleto = await Pedido.findByPk(pedido.id, {
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
              as: "producto",
              include: [
                {
                  model: Imagenes,
                  as: "imagenes"
                }
              ]
            }
          ]
        },
        {
          model: Pago,
          as: "pago"
        }
      ]
    });

    notificarNuevoPedido(pedidoCompleto).catch((err) => {
      console.error('Error enviando correos de nuevo pedido:', err);
    });

    res.status(201).json(pedidoCompleto || pedido);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
};

// Actualizar pedido
export const actualizarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [{ model: Usuario, as: "usuario", attributes: ["id", "nombre", "apellido", "email"] }]
    });

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

    // Whitelist: desde el panel solo se cambia el estado. Total, usuario e
    // items no se tocan por acá (integridad de la venta).
    const ESTADOS_VALIDOS = ["Pendiente", "Enviado", "Entregado", "Cancelado"];
    // Máquina de estados: Entregado y Cancelado son terminales (inmutables);
    // Enviado solo puede avanzar a Entregado (no se "despacha" dos veces ni
    // vuelve atrás). Mismo criterio en el front (OrderManagement).
    const TRANSICIONES = {
      Pendiente: ["Enviado", "Cancelado"],
      Enviado: ["Entregado"],
      Entregado: [],
      Cancelado: [],
    };
    const { estado } = req.body;
    if (estado !== undefined && !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({
        mensaje: `Estado inválido. Válidos: ${ESTADOS_VALIDOS.join(", ")}`
      });
    }
    const actual = pedido.estado;
    const permitidas = TRANSICIONES[actual] || [];
    if (estado !== undefined && estado !== actual && !permitidas.includes(estado)) {
      return res.status(409).json({
        mensaje: permitidas.length === 0
          ? `Pedido ${actual.toLowerCase()}: ya está cerrado y no admite cambios.`
          : `Transición no permitida desde "${actual}". Permitidas: ${permitidas.join(", ")}.`
      });
    }

    await pedido.update({ estado });

    
    if (estado !== undefined && estado !== actual) {
      notificarCambioEstado(pedido, estado).catch((err) => {
        console.error("Error al despachar mail de cambio de estado:", err);
      });
    }

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
