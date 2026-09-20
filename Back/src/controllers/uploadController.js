import upload from "../middlewares/uploadMiddleware.js";
import { subirImagen } from "../services/ociService.js";
import { Imagenes } from "../models/index.js";
import crypto from "crypto";

export const uploadImage = [
  upload.single("imagen"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ mensaje: "No se envió ningún archivo" });
      }

      const idProducto = req.body.idProducto || null;
      const hash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");

      // paranoid:false porque una fila borrada (soft delete) SIGUE ocupando el
      // UNIQUE de hash en MySQL. Sin esto, re-subir un archivo alguna vez usado
      // y borrado → findOne no lo ve → re-sube bytes → el INSERT choca con el UNIQUE.
      const existente = await Imagenes.findOne({ where: { hash }, paranoid: false });
      const mismoDueño = existente && String(existente.idProducto) === String(idProducto);

      // 1. Vigente y mismo dueño → se devuelve tal cual (sin re-subir)
      if (existente && !existente.deletedAt && mismoDueño) {
        console.log(`[Upload] Imagen reutilizada: ${existente.imagen}`);
        return res.status(201).json(existente);
      }

      // 2. Borrada del mismo dueño → se restaura y va al final de la galería
      if (existente && existente.deletedAt && mismoDueño) {
        await existente.restore();
        const maxOrden = await Imagenes.max("orden", { where: { idProducto } });
        await existente.update({ orden: (maxOrden ?? -1) + 1 });
        await existente.reload();
        console.log(`[Upload] Imagen restaurada: ${existente.imagen}`);
        return res.status(201).json(existente);
      }

      // 3. Resto (otro dueño, sin dueño, o hash nuevo): fila nueva. Si el path
      // se conoce se reutiliza sin re-subir a OCI; hash NULL para no chocar con
      // el UNIQUE (la fila original conserva el hash canónico).
      const path = existente
        ? existente.imagen
        : await subirImagen(req.file.buffer, req.file.originalname);

      const maxOrden = await Imagenes.max("orden", { where: { idProducto } })

      const imagen = await Imagenes.create({
        orden:(maxOrden ?? -1)+1,

        imagen: path,
        // NULL no choca con el UNIQUE de hash (MySQL permite varios NULL)
        hash: existente ? null : hash,
        descripcion: req.body.descripcion || null,
        idProducto,
      });
      res.status(201).json(imagen);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      if (error?.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ mensaje: 'Esa imagen ya está registrada. Reintentá la subida.' });
      }
      res.status(500).json({ mensaje: error.message });
    }
  },
];