import { enviarCorreo } from './emailService.js';
import {
  emailBase,
  boton,
  cajaDatos,
  cajaEstado,
  cajaTotal,
  encabezadoSeccion,
  filaDato,
  moneda,
  parrafo,
  pillEstado,
  sitioUrl,
  tablaItems
} from './emailTemplates.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

const mensajesPorEstado = {
  'Pendiente': 'Tu pedido quedó en estado Pendiente. Lo preparamos en los próximos días.',
  'Enviado': '¡Tu pedido está en camino! En breve lo vas a recibir en tu domicilio.',
  'Entregado': 'Tu pedido figura como entregado. ¡Esperamos que disfrutes tus productos!',
  'Cancelado': 'Tu pedido fue cancelado. Si creés que se trata de un error, contactate con soporte.',
};

export const notificarNuevoPedido = async (pedidoCompleto) => {
  const { id, total, usuario, items, pago } = pedidoCompleto;

  const cuerpoCliente = `
    ${parrafo(`Registramos tu pedido <strong style="color:#1f2328;">#${id}</strong> con el detalle de tu compra.`)}
    <div style="margin:0 0 14px;">
      ${cajaDatos([
        filaDato('Número de pedido', `#${id}`),
        filaDato('Método de pago', pago?.metodoPago || 'A convenir'),
      ])}
    </div>
    ${encabezadoSeccion('Detalle de la compra')}
    ${tablaItems(items)}
    <div style="margin:16px 0 20px;">${cajaTotal(total)}</div>
    <div style="margin:22px 0 4px;">${boton('Ver mis pedidos', sitioUrl('/perfil'))}</div>
  `;

  const mailCliente = {
    to: usuario.email,
    subject: `Confirmación de Pedido #${id} - MJM 3D`,
    html: emailBase({
      titulo: `¡Gracias por tu compra, ${usuario.nombre}!`,
      resumen: `Pedido #${id} confirmado · ${moneda(total)}`,
      notaPie: `Recibiste este correo porque realizaste el pedido #${id} en MJM 3D.`,
      cuerpo: cuerpoCliente,
    }),
  };

  const cuerpoAdmin = `
    ${parrafo(`Recibimos un pedido de <strong style="color:#24272c;">${usuario.nombre} ${usuario.apellido}</strong> (${usuario.email}).`)}
    <div style="margin:0 0 14px;">
      ${cajaDatos([
        filaDato('Monto total', moneda(total)),
        filaDato('Forma de pago', pago?.metodoPago || 'No especificada'),
      ])}
    </div>
    ${encabezadoSeccion('Artículos a preparar')}
    ${tablaItems(items, { conPrecios: false })}
    <div style="margin:16px 0 6px;">${pillEstado('Pendiente')}</div>
    ${parrafo('El pedido ya figura en el panel de pedidos para su preparación.')}
  `;

  const mailAdmin = {
    to: ADMIN_EMAIL,
    subject: `[NUEVO PEDIDO #${id}] Para preparar · ${moneda(total)}`,
    html: emailBase({
      titulo: `Nuevo pedido #${id} recibido`,
      kicker: 'Para preparar',
      resumen: `Nuevo pedido #${id} · ${usuario.nombre} ${usuario.apellido}`,
      notaPie: 'Correo operativo interno. Solo lo recibe el equipo administrativo de MJM 3D.',
      cuerpo: cuerpoAdmin,
      variante: 'admin',
    }),
  };

  const resultados = [];

  try {
    const resCliente = await enviarCorreo(mailCliente);
    resultados.push({ status: 'fulfilled', value: resCliente });
  } catch (error) {
    console.error(`❌ Falló mail a Cliente (${usuario?.email}):`, error.message);
    resultados.push({ status: 'rejected', reason: error });
  }

  try {
    const resAdmin = await enviarCorreo(mailAdmin);
    resultados.push({ status: 'fulfilled', value: resAdmin });
  } catch (error) {
    console.error(`❌ Falló mail a Admin (${ADMIN_EMAIL}):`, error.message);
    resultados.push({ status: 'rejected', reason: error });
  }

  return resultados;
};

export const notificarCambioEstado = async (pedido, nuevoEstado) => {
  const usuario = pedido.usuario;
  if (!usuario || !usuario.email) return;

  const descripcion = mensajesPorEstado[nuevoEstado] || `El nuevo estado de tu pedido es: ${nuevoEstado}.`;

  const cuerpo = `
    ${parrafo(`Tu pedido <strong style="color:#1f2328;">#${pedido.id}</strong> cambió de estado.`)}
    <div style="margin:20px 0;">${cajaEstado(nuevoEstado, descripcion)}</div>
    <div style="margin:22px 0 4px;">${boton('Ver mis pedidos', sitioUrl('/perfil'))}</div>
  `;

  return await enviarCorreo({
    to: usuario.email,
    subject: `Actualización de tu Pedido #${pedido.id}: ${nuevoEstado}`,
    html: emailBase({
      titulo: `Tu pedido #${pedido.id} se actualizó`,
      kicker: 'Actualización de pedido',
      resumen: `Tu pedido #${pedido.id} ahora está: ${nuevoEstado}`,
      notaPie: `Recibiste este correo porque tenés el pedido #${pedido.id} en MJM 3D.`,
      cuerpo,
    }),
  });
};
