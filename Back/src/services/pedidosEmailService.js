import { transporter } from './emailService.js';

const FROM_SENDER = process.env.EMAIL_FROM || process.env.EMAIL_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

/**
 * 1. Notificación doble al confirmar pedido:
 *    a) Comprobante al cliente
 *    b) Alerta operativa al administrador
 */
export const notificarNuevoPedido = async (pedidoCompleto) => {
  const { id, total, usuario, items, pago } = pedidoCompleto;

  const itemsHtml = items?.map((it) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${it.producto?.nombre || 'Producto'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${it.cantidad}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${Number(it.precioUnitario).toLocaleString()}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${Number(it.subtotal).toLocaleString()}</td>
    </tr>
  `).join('') || '';

  // a) Correo para el Cliente (Comprobante detallado)
  const mailCliente = {
    from: FROM_SENDER,
    to: usuario.email,
    subject: `Confirmación de Pedido #${id} - MJM 3D`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2 style="color: #2b6cb0;">¡Gracias por tu compra, ${usuario.nombre}!</h2>
        <p>Hemos registrado tu pedido <strong>#${id}</strong> correctamente.</p>
        <p><strong>Método de pago:</strong> ${pago?.metodoPago || 'A convenir'}</p>
        
        <h3>Detalle de la compra:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f7fafc; text-align: left;">
              <th style="padding: 8px;">Producto</th>
              <th style="padding: 8px; text-align: center;">Cant.</th>
              <th style="padding: 8px; text-align: right;">Precio</th>
              <th style="padding: 8px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <h3 style="text-align: right; margin-top: 15px;">Total: $${Number(total).toLocaleString()}</h3>
        <p style="font-size: 13px; color: #718096; margin-top: 20px;">
          Te notificaremos por correo electrónico a medida que el estado de tu pedido cambie.
        </p>
      </div>
    `,
  };

  // b) Correo para el Administrador (Alerta operativa)
  const mailAdmin = {
    from: FROM_SENDER,
    to: ADMIN_EMAIL,
    subject: `🚨 [NUEVO PEDIDO #${id}] Para Preparar - $${Number(total).toLocaleString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2 style="color: #c53030;">Alerta: Nuevo Pedido #${id} Recibido</h2>
        <p><strong>Cliente:</strong> ${usuario.nombre} ${usuario.apellido} (${usuario.email})</p>
        <p><strong>Monto total:</strong> $${Number(total).toLocaleString()}</p>
        <p><strong>Forma de pago:</strong> ${pago?.metodoPago || 'No especificada'}</p>
        
        <h3>Artículos a preparar:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #edf2f7;">
              <th style="padding: 8px;">Producto</th>
              <th style="padding: 8px; text-align: center;">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            ${items?.map((it) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${it.producto?.nombre || 'Producto'}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${it.cantidad}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
  };

  const resultados = [];

  // 1. Enviar al cliente
  try {
    const resCliente = await transporter.sendMail(mailCliente);
    console.log(`✅ Mail enviado a Cliente (${usuario?.email})`);
    resultados.push({ status: 'fulfilled', value: resCliente });
  } catch (error) {
    console.error(`❌ Falló mail a Cliente (${usuario?.email}):`, error);
    resultados.push({ status: 'rejected', reason: error });
  }

  // 2. Enviar al administrador (Gmail no necesita esperar 11 segundos asi que sacamos el timer)
  try {
    const resAdmin = await transporter.sendMail(mailAdmin);
    console.log(`✅ Mail enviado a Admin (${ADMIN_EMAIL})`);
    resultados.push({ status: 'fulfilled', value: resAdmin });
  } catch (error) {
    console.error(`❌ Falló mail a Admin (${ADMIN_EMAIL}):`, error);
    resultados.push({ status: 'rejected', reason: error });
  }

  return resultados;
};

/**
 * 2. Notificación al cliente por cambio de estado del pedido
 */
export const notificarCambioEstado = async (pedido, nuevoEstado) => {
  const usuario = pedido.usuario;
  if (!usuario || !usuario.email) return;

  const mensajesPorEstado = {
    'En preparación': 'Tu pedido está siendo armado e impreso por nuestro equipo.',
    'Enviado': '¡Tu pedido está en camino! En breve lo recibirás en tu domicilio.',
    'Entregado': 'Tu pedido figura como entregado. ¡Esperamos que disfrutes tus productos!',
    'Cancelado': 'Tu pedido ha sido cancelado. Si crees que se trata de un error, comunícate con soporte.',
  };

  const descripcion = mensajesPorEstado[nuevoEstado] || `El nuevo estado es: ${nuevoEstado}.`;

  const mailOptions = {
    from: FROM_SENDER,
    to: usuario.email,
    subject: `Actualización de tu Pedido #${pedido.id}: ${nuevoEstado}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2>Hola, ${usuario.nombre}</h2>
        <p>Te informamos que hubo una actualización en tu pedido <strong>#${pedido.id}</strong>.</p>
        <div style="padding: 15px; background: #edf2f7; border-left: 4px solid #3182ce; margin: 20px 0;">
          <h3 style="margin: 0; color: #2b6cb0;">Nuevo estado: ${nuevoEstado}</h3>
          <p style="margin: 8px 0 0 0;">${descripcion}</p>
        </div>
        <p style="font-size: 13px; color: #718096;">Podés consultar el historial de tus pedidos desde tu cuenta en nuestro sitio web.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};