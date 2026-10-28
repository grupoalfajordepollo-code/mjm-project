import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const enviarCorreo = async (destinatario, asunto, mensaje) => {
  return await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: destinatario,
    subject: asunto,
    text: mensaje
  });
};

