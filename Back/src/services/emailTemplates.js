const BRAND = "#B02F00";
const BRAND_OSCURO = "#8a2500";
const TINT = "#f5e3dc";
const TINT_SUAVE = "#fff5f2";
const CHARCOAL = "#24272c";
const CHARCOAL_TEXTO = "#899fb5";
const ACENTO_ADMIN = "#ff5a2c";
const TEXTO = "#1f2328";
const TEXTO_SUAVE = "#4b5563";
const TEXTO_DILUIDO = "#9ca3af";
const BORDE = "#e6d5cc";
const FONDO = "#f8f9fb";
const FUENTE = "'Space Grotesk', Arial, sans-serif";

export const sitioUrl = (ruta = "") =>
  `${(process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "")}${ruta}`;

export const moneda = (monto) => {
  const valor = Number(monto) || 0;
  const decimales = Number.isInteger(valor) ? 0 : 2;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor);
};

const ESTADOS = {
  Pendiente: { fondo: "#fef0cd", texto: "#9a6a00", borde: "#f3dfae" },
  Enviado: { fondo: "#e3f2fd", texto: "#0369a1", borde: "#c8e5fb" },
  Entregado: { fondo: "#d1f4e0", texto: "#1e7b45", borde: "#b9ebcb" },
  Cancelado: { fondo: "#ececee", texto: "#52525b", borde: "#d9d9de" },
};

const coloresEstado = (estado) =>
  ESTADOS[estado] || { fondo: "#ececee", texto: "#52525b", borde: "#d9d9de" };

export const pillEstado = (estado) => {
  const c = coloresEstado(estado);
  return `<span style="display:inline-block;background-color:${c.fondo};border:1px solid ${c.borde};color:${c.texto};font-family:${FUENTE};font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:5px 12px;border-radius:999px;">${estado}</span>`;
};

export const cajaEstado = (estado, mensaje) => {
  const c = coloresEstado(estado);
  return `<div style="background-color:${c.fondo};border:1px solid ${c.borde};border-radius:10px;padding:16px 18px;">
    <p style="margin:0 0 6px;font-family:${FUENTE};font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${c.texto};">${estado}</p>
    <p style="margin:0;font-family:${FUENTE};font-size:14px;line-height:1.5;color:${TEXTO};">${mensaje}</p>
  </div>`;
};

export const boton = (texto, url, { color = BRAND, ancho = false } = {}) => {
  const base = `display:${ancho ? "block" : "inline-block"};background-color:${color};color:#ffffff;font-family:${FUENTE};font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;padding:13px 24px;border-radius:8px;text-align:center;`;
  return ancho
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td bgcolor="${color}" style="background-color:${color};border-radius:8px;"><a href="${url}" style="${base};padding:13px 16px;">${texto}</a></td></tr></table>`
    : `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="${color}" style="background-color:${color};border-radius:8px;"><a href="${url}" style="${base}">${texto}</a></td></tr></table>`;
};

export const filaDato = (etiqueta, valor) => `
  <tr>
    <td style="padding:9px 16px;font-family:${FUENTE};font-size:12px;color:#6b7280;">${etiqueta}</td>
    <td align="right" style="padding:9px 16px;font-family:${FUENTE};font-size:13px;font-weight:700;color:${TEXTO};">${valor}</td>
  </tr>`;

export const cajaDatos = (filas) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background-color:${TINT_SUAVE};border:1px solid ${TINT};border-radius:10px;">${[].concat(filas).join('')}</table>`;

export const cajaTotal = (monto) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-top:2px solid ${TEXTO};"><tr>
    <td style="padding-top:12px;font-family:${FUENTE};font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">Total</td>
    <td align="right" style="padding-top:12px;font-family:${FUENTE};font-size:20px;font-weight:700;color:${TEXTO};">${moneda(monto)}</td>
  </tr></table>`;

export const encabezadoSeccion = (texto) => `
  <p style="margin:22px 0 8px;font-family:${FUENTE};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;">${texto}</p>`;

export const parrafo = (contenido) => `
  <p style="margin:0 0 14px;font-family:${FUENTE};font-size:14px;line-height:1.6;color:${TEXTO_SUAVE};">${contenido}</p>`;

export const tablaItems = (items, { conPrecios = true } = {}) => {
  const th = `padding:10px 14px;font-family:${FUENTE};font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND};background-color:${TINT_SUAVE};border-bottom:1px solid ${TINT};`;
  const td = `padding:10px 14px;font-family:${FUENTE};font-size:13px;color:${TEXTO};`;

  const filas = (items || [])
    .map(
      (it, i) => `
    <tr style="background-color:${i % 2 ? "#fff9f7" : "#ffffff"};">
      <td style="${td}border-top:1px solid ${BORDE};">${it?.producto?.nombre || "Producto"}</td>
      <td align="center" style="${td}border-top:1px solid ${BORDE};width:56px;">${it?.cantidad ?? "-"}</td>
      ${
        conPrecios
          ? `<td align="right" style="${td}border-top:1px solid ${BORDE};width:96px;">${moneda(it?.precioUnitario)}</td>
             <td align="right" style="${td}border-top:1px solid ${BORDE};width:110px;font-weight:700;">${moneda(it?.subtotal)}</td>`
          : ""
      }
    </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid ${BORDE};border-radius:10px;">
    <tr>
      <th align="left" style="${th}border-radius:10px 0 0 0;">Producto</th>
      <th align="center" style="${th}width:56px;">Cant.</th>
      ${conPrecios ? `<th align="right" style="${th}width:96px;">Precio</th><th align="right" style="${th}width:110px;border-radius:0 10px 0 0;">Subtotal</th>` : `<th align="right" style="${th}width:56px;border-radius:0 10px 0 0;">Qty</th>`}
    </tr>
    ${filas}
  </table>`;
};

export const emailBase = ({ titulo, kicker, cuerpo, resumen, notaPie, variante = "publica" }) => {
  const admin = variante === "admin";
  const cabecera = admin
    ? `<tr><td style="background-color:${CHARCOAL};padding:20px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-family:${FUENTE};font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.02em;">MJM 3D</td>
          <td align="right" style="font-family:${FUENTE};font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${CHARCOAL_TEXTO};"><span style="color:${ACENTO_ADMIN};">■</span>&nbsp;Operator mode</td>
        </tr></table>
      </td></tr>`
    : `<tr><td style="padding:24px 32px;border-bottom:1px solid ${BORDE};">
        <span style="font-family:${FUENTE};font-size:20px;font-weight:700;color:${BRAND};letter-spacing:0.02em;">MJM 3D</span>
        <span style="margin-left:10px;font-family:${FUENTE};font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${TEXTO_DILUIDO};">Impresión 3D</span>
      </td></tr>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${titulo}</title>
</head>
<body style="margin:0;padding:0;background-color:${FONDO};">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;">${resumen || titulo}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background-color:${FONDO};">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid ${BORDE};border-radius:14px;">
          ${cabecera}
          <tr>
            <td style="padding:28px 32px 32px;">
              ${kicker ? `<p style="margin:0 0 6px;font-family:${FUENTE};font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND};">${kicker}</p>` : ""}
              <h1 style="margin:0 0 16px;font-family:${FUENTE};font-size:22px;line-height:1.3;font-weight:700;color:${TEXTO};">${titulo}</h1>
              <div style="font-family:${FUENTE};">${cuerpo}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;border-top:1px solid ${BORDE};background-color:#fbf9f7;border-radius:0 0 14px 14px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-family:${FUENTE};font-size:12px;color:${TEXTO_DILUIDO};">MJM 3D · Impresión 3D</td>
                <td align="right" style="font-family:${FUENTE};font-size:12px;white-space:nowrap;">
                  <a href="${sitioUrl("/catalogo")}" style="color:${BRAND};font-weight:700;text-decoration:none;">Catálogo</a>
                  &nbsp;·&nbsp;
                  <a href="${sitioUrl("/perfil")}" style="color:${BRAND};font-weight:700;text-decoration:none;">Mis pedidos</a>
                </td>
              </tr></table>
            </td>
          </tr>
        </table>
        <p style="max-width:520px;margin:14px auto 0;font-family:${FUENTE};font-size:11px;line-height:1.6;color:${TEXTO_DILUIDO};text-align:center;">${notaPie || "Recibiste este correo porque tenés una cuenta en MJM 3D."}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
