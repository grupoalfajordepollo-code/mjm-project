import { transporter } from '../config/nodemailer.config.js';
import crypto from 'crypto';
// import { pool as db } from '../config/db.js'; // Descomenta cuando conectes tu base de datos MySQL

// 1. Bienvenida en registro de usuario nuevo
export const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        await transporter.sendMail({
            from: '"Mi Marketplace" <no-reply@marketplace.com>',
            to: userEmail,
            subject: '¡Bienvenido a nuestro Marketplace!',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>¡Hola ${userName}, bienvenido/a!</h2>
                    <p>Tu cuenta ha sido creada exitosamente en nuestra plataforma.</p>
                    <p>Ya podés explorar nuestro catálogo completo.</p>
                    <a href="${process.env.FRONTEND_URL}/catalog" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">Explorar Catálogo</a>
                </div>
            `
        });
        console.log(`✅ Correo de bienvenida enviado a ${userEmail}`);
    } catch (error) {
        console.error('❌ Error enviando correo de bienvenida:', error);
    }
};

// 2. Recuperación segura de contraseña
export const sendPasswordResetEmail = async (userEmail) => {
    try {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expireDate = new Date(Date.now() + 3600000); // 1 hora de validez

        // TODO: Guarda el token y la fecha de expiración en tu tabla de MySQL
        /*
        await db.query(
            'UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?',
            [resetToken, expireDate, userEmail]
        );
        */

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: '"Soporte Marketplace" <no-reply@marketplace.com>',
            to: userEmail,
            subject: 'Restablecimiento de contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h3>Solicitud de cambio de contraseña</h3>
                    <p>Hacé clic en el siguiente enlace para definir una nueva clave (válido por 1 hora):</p>
                    <a href="${resetUrl}" style="color: #007bff;">Restablecer Contraseña</a>
                </div>
            `
        });
        console.log(`✅ Correo de recuperación enviado a ${userEmail}`);
    } catch (error) {
        console.error('❌ Error enviando correo de recuperación:', error);
    }
};

// 3. Generación de pedido (Doble notificación: Cliente + Admin)
export const sendOrderNotifications = async (orderData, clientEmail, adminEmail) => {
    try {
        // Correo para el Cliente
        const clientMail = transporter.sendMail({
            from: '"Mi Marketplace" <no-reply@marketplace.com>',
            to: clientEmail,
            subject: `Comprobante de tu compra #${orderData.id}`,
            html: `<h3>¡Gracias por tu compra, ${orderData.clientName}!</h3>
                   <p>Tu pedido #${orderData.id} ha sido registrado exitosamente por un total de $${orderData.total}.</p>`
        });

        // Correo para el Administrador
        const adminMail = transporter.sendMail({
            from: '"Sistema Marketplace" <no-reply@marketplace.com>',
            to: adminEmail,
            subject: `[NUEVO PEDIDO] #${orderData.id}`,
            html: `<h3>Alerta Operativa</h3>
                   <p>El cliente <strong>${clientEmail}</strong> realizó un nuevo pedido (#${orderData.id}).</p>
                   <p>Total: $${orderData.total}</p>`
        });

        await Promise.all([clientMail, adminMail]);
        console.log(`✅ Notificaciones de pedido #${orderData.id} enviadas con éxito.`);
    } catch (error) {
        console.error('❌ Error enviando notificaciones de pedido:', error);
    }
};

// 4. Seguimiento por cambio de estado del pedido
export const sendOrderStatusUpdate = async (clientEmail, orderId, newStatus) => {
    try {
        await transporter.sendMail({
            from: '"Mi Marketplace" <no-reply@marketplace.com>',
            to: clientEmail,
            subject: `Actualización de tu pedido #${orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h3>Novedades sobre tu pedido #${orderId}</h3>
                    <p>El estado actual de tu compra cambió a: <strong>${newStatus}</strong></p>
                    <p>Gracias por confiar en nosotros.</p>
                </div>
            `
        });
        console.log(`✅ Actualización de estado (${newStatus}) enviada para el pedido #${orderId}`);
    } catch (error) {
        console.error('❌ Error enviando actualización de estado:', error);
    }
};