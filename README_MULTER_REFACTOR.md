# 🚀 Refactorización de Subida de Archivos con Multer (Arquitectura Limpia + SRP)

Muchachos, les dejo este resumen para que estemos todos en la misma página de **qué se cambió, cómo funciona ahora y por qué NO seguimos al pie de la letra la demo de la cátedra**.

---

## 🧐 ¿Por qué no usamos la implementación tal cual la dio el profe?

La demo de la cátedra tenía un par de problemas serios de arquitectura:

1. **Violaba el Principio de Responsabilidad Única (SRP)**:
   - El **controller** tenía metido adentro `upload.single("imagen")` en un array. Un controller debe encargarse **únicamente de la lógica de negocio y responder la petición HTTP**, no de configurar middlewares de parsing de multipart ni lidiar con los bytes que entran. Si mañana cambiás el límite de tamaño de la foto, ¿por qué tendrías que tocar el controller?
2. **Código CommonJS viejo (`require` / `module.exports`)**:
   - Todo nuestro proyecto corre con **ES Modules** (`import` / `export`), por lo que meter CommonJS rompía el estándar del repositorio.
3. **Inconsistencias y subida ineficiente**:
   - En una galería de productos, hacer un request HTTP por cada foto de a una satura la red y multiplica los tiempos de carga.

---

## 🏗️ La Arquitectura Limpia que implementamos

Separamos las responsabilidades en 4 capas bien definidas:

```
Back/src/
├── config/
│   └── multer.config.js       ← Configuración pura: storage en disco, carpetas y filtros MIME
├── middlewares/
│   └── uploadMiddleware.js    ← Instancias de Multer + wrapper de captura de errores HTTP 400
├── routes/
│   └── uploadRoutes.js        ← Definición de rutas: conecta auth + admin + multer + controller
└── controllers/
    └── uploadController.js     ← Lógica pura: hash SHA-256, deduplicación en MySQL y respuesta
```

### ¿Qué hace cada archivo?

1. **`config/multer.config.js`**:
   - Define las rutas de almacenamiento (`uploads/images`, `uploads/documents`).
   - Crea automáticamente las carpetas si no existen (`ensureUploadDirs`) al arrancar el server.
   - Define la política de nombres únicos (`cleanName-timestamp-random.ext`).
   - Define los `fileFilters` (rechaza cualquier cosa que no sea imagen válida).

2. **`middlewares/uploadMiddleware.js`**:
   - Crea la instancia `uploadImages = handleMulterError(uploadImage.array('imagenes', 5))`.
   - Soporta subir de **1 a 5 imágenes simultáneas** en una sola petición.
   - Si un archivo excede los 10MB o mandan más de 5, devuelve un JSON de error `400 Bad Request` limpio sin tumbar el server ni ensuciar el controller.

3. **`routes/uploadRoutes.js`**:
   - Puramente declarativo:
     ```js
     router.post('/', authMiddleware, adminMiddleware, uploadImages, uploadImageController);
     ```

4. **`controllers/uploadController.js`**:
   - Recibe `req.files` ya validado.
   - Lee cada archivo y le calcula un hash **SHA-256**.
   - **Anti-duplicados inteligente**: Si la misma imagen ya fue subida para ese producto, borra el archivo temporal del disco para no ocupar espacio al pedo y reutiliza el registro existente en la base de datos.
   - Si es nueva, crea la fila en la tabla `Imagenes` con la ruta pública `/archivos/images/nombre.webp`.

---

## 🌐 Servidor de estáticos y desacople de OCI

- **Servidor local en Express**: En `routes/index.js` montamos:
  ```js
  router.use('/archivos', express.static(UPLOADS_DIR));
  ```
  Cualquier foto subida se accede directo desde `http://localhost:3000/api/archivos/images/...`.
- **Chau dependencia de OCI**: Ya no dependemos del bucket de Oracle Cloud para el guardado local de imágenes.
- **Fallback / Placeholder**: Si un producto no tiene imagen, el frontend devuelve automáticamente `/placeholder.webp` (ubicado en `Front/public/placeholder.webp`).

---

## ⚡ Cambios en el Frontend

Antes el front hacía un bucle `for...of` mandando $N$ peticiones separadas por cada foto. Ahora:

1. **`uploadService.js`**:
   - `subirImagenes(files, idProducto)` arma un solo `FormData` y manda todas las fotos bajo la clave `"imagenes"`.
2. **`ProductCreation.jsx`**:
   - Hace **una sola llamada HTTP**:
     ```js
     const creadas = await subirImagenes(archivosNuevos.map(n => n.file), productId);
     const idsCreados = creadas.map(img => img.id);
     ```
   - Mucho más rápido, menos consumo de red y atómico.

---

## ✅ Resumen de Pruebas realizadas
- [x] Subida múltiple batch (2 imágenes juntas) -> `201 Created`
- [x] Lectura estática directa por HTTP -> `200 OK`
- [x] Deduplicación por hash SHA-256 (no duplica archivos en disco ni filas en MySQL) -> `OK`
- [x] Filtro de archivos no permitidos (ej: `.txt`) -> `400 Bad Request` con mensaje claro.
- [x] Reset de base de datos y seeders corriendo limpios.
