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

      const hash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");

      const existente = await Imagenes.findOne({ where: { hash } });
      if (existente) {
        console.log(`[Upload] Imagen reutilizada (hash duplicate): ${existente.imagen}`);
        return res.status(201).json(existente);
      }

      const path = await subirImagen(req.file.buffer, req.file.originalname);
      const imagen = await Imagenes.create({
        imagen: path,
        hash,
        descripcion: req.body.descripcion || null,
      });
      res.status(201).json(imagen);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      res.status(500).json({ mensaje: error.message });
    }
  },
];