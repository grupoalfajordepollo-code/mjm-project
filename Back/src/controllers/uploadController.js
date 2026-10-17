import fs from 'fs';
import crypto from 'crypto';
import { Imagenes } from '../models/index.js';

// Este controller SOLO maneja la lógica de negocio y persistencia en DB
// Ya no sabe de Multer, límites ni filtros. Solo asume que req.file existe.
export const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mensaje: "No se envió ningún archivo" });
    }

    const idProducto = req.body.idProducto || null;
    const resultados = [];

    for (const file of req.files) {
      const fileBuffer = fs.readFileSync(file.path);
      const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

      const existente = await Imagenes.findOne({ where: { hash }, paranoid: false });
      const mismoDueño = existente && String(existente.idProducto) === String(idProducto);

      // Si existe vigente del mismo dueño
      if (existente && !existente.deletedAt && mismoDueño) {
        fs.unlinkSync(file.path);
        resultados.push(existente);
        continue;
      }

      // Si estaba borrada del mismo dueño, restauramos
      if (existente && existente.deletedAt && mismoDueño) {
        fs.unlinkSync(file.path);
        await existente.restore();
        const maxOrden = await Imagenes.max("orden", { where: { idProducto } });
        await existente.update({ orden: (maxOrden ?? -1) + 1 });
        await existente.reload();
        resultados.push(existente);
        continue;
      }

      // Archivo nuevo
      const rutaPublica = `/archivos/images/${file.filename}`;
      const maxOrden = await Imagenes.max("orden", { where: { idProducto } });

      const nuevaImagen = await Imagenes.create({
        idProducto,
        orden: (maxOrden ?? -1) + 1,
        imagen: rutaPublica,
        hash: existente ? null : hash,
        descripcion: req.body.descripcion || null,
      });

      resultados.push(nuevaImagen);
    }

    return res.status(201).json(resultados);



  } catch (error) {
    console.error("[Upload Controller Error]:", error);

    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ mensaje: "Esa imagen ya está registrada." });
    }

    return res.status(500).json({ mensaje: error.message || "Error interno del servidor" });
  }
};
