import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargamos el .env buscando la raíz del proyecto (dos niveles arriba de src/config)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pluralize: false
  }
);

// Función asíncrona para testear la salud de la conexión
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Base de datos lista.');
  } catch (error) {
    console.error('❌ Error crítico:', error.message);
    process.exit(1); // Detenemos la app si no hay DB
  }
};