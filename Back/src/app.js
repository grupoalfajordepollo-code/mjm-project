import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ensureUploadDirs } from './config/multer.config.js';

ensureUploadDirs(); // crea carpetas si no existen

const app = express();

app.use(cors());           // Permite que React se conecte
app.use(morgan('dev'));    // Muestra: GET /products 200 en consola
app.use(express.json());   // Entiende los objetos JSON que enviamos
app.use(express.urlencoded({ extended: true }));

// Rutas
import apiRoutes from './routes/index.js';
app.use('/api', apiRoutes);

export default app;