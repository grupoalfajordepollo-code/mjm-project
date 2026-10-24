import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Asegurarnos de que dotenv cargue las variables si no se hace en el entry point principal
dotenv.config();

// Configuramos el transportador SMTP usando las credenciales de Mailtrap
export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // sandbox.smtp.mailtrap.io
    port: Number(process.env.EMAIL_PORT) || 2525, // 2525
    auth: {
        user: process.env.EMAIL_USER, // a536610acfd667
        pass: process.env.EMAIL_PASS  // Tu contraseña de Mailtrap
    }
});

// Verificamos la conexión al iniciar la aplicación
transporter.verify()
    .then(() => {
        console.log('✅ Servidor listo para enviar correos a través de Mailtrap');
    })
    .catch((error) => {
        console.error('❌ Error al conectar con el servidor de correo:', error);
    });