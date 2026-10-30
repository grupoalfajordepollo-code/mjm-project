import Usuario from "../models/Usuario.js";
import { enviarCorreo } from "../services/emailService.js";
import { emailBase, boton, parrafo } from "../services/emailTemplates.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

// Solicitar recuperación de contraseña
export const solicitarRecuperacion = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        mensaje: "Debés ingresar un correo electrónico"
      });
    }

    const usuario = await Usuario.findOne({
      where: { email }
    });

    // No informar si el correo está registrado
    if (!usuario) {
      return res.json({
        mensaje: "Si el correo está registrado, recibirás un enlace de recuperación"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        tipo: "recuperacion",
        version: crypto
          .createHash("sha256")
          .update(usuario.password)
          .digest("hex")
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const enlace = `${process.env.FRONTEND_URL}/restablecer-password?token=${encodeURIComponent(token)}`;

    await enviarCorreo({
      to: usuario.email,
      subject: "Recuperación de contraseña - MJM 3D",
      html: emailBase({
        titulo: "Recuperá tu contraseña",
        kicker: "Recuperación de contraseña",
        resumen: "Solicitud para restablecer tu contraseña",
        notaPie: "Recibiste este correo porque se solicitó una recuperación de contraseña para tu cuenta en MJM 3D.",
        cuerpo: `
          ${parrafo(`Hola <strong style="color:#1f2328;">${usuario.nombre}</strong>, recibimos una solicitud para recuperar tu contraseña. Elegí una nueva usando el botón de abajo.`)}
          <div style="margin:20px 0;">${boton("Restablecer contraseña", enlace, { ancho: true })}</div>
          ${parrafo(`<span style="font-size:12px;color:#9ca3af;">Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br><span style="word-break:break-all;">${enlace}</span></span>`)}
          ${parrafo('<strong style="color:#1f2328;">El enlace vence en 15 minutos.</strong> Si no fuiste vos quien solicitó el cambio, podés ignorar este correo y tu contraseña actual seguirá funcionando sin cambios.')}
        `,
      }),
    });

    res.json({
      mensaje: "Si el correo está registrado, recibirás un enlace de recuperación"
    });

  } catch (error) {
    console.error("Error de recuperación:", error.message);

    res.status(500).json({
      mensaje: "No se pudo procesar la solicitud"
    });
  }
};

// Restablecer contraseña
export const restablecerPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        mensaje: "El token y la nueva contraseña son obligatorios"
      });
    }

    const datos = jwt.verify(token, process.env.JWT_SECRET);

    if (datos.tipo !== "recuperacion") {
      return res.status(400).json({
        mensaje: "Token de recuperación inválido"
      });
    }

    const usuario = await Usuario.findByPk(datos.id);

    if (!usuario) {
      return res.status(400).json({
        mensaje: "Enlace de recuperación inválido"
      });
    }

    const versionActual = crypto
      .createHash("sha256")
      .update(usuario.password)
      .digest("hex");

    if (datos.version !== versionActual) {
      return res.status(400).json({
        mensaje: "Este enlace ya no es válido"
      });
    }

    // Actualizar mediante Sequelize para ejecutar el hook de bcrypt
    await usuario.update({ password });

    res.json({
      mensaje: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(400).json({
        mensaje: "El enlace es inválido o ha vencido"
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        mensaje:
          error.errors?.[0]?.message ||
          "La contraseña no cumple los requisitos"
      });
    }

    console.error("Error al restablecer:", error.message);

    res.status(500).json({
      mensaje: "No se pudo restablecer la contraseña"
    });
  }
};

