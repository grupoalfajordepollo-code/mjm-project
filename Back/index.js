import app from './src/app.js';
import { sequelize, testConnection } from './src/config/database.js';
//import './src/models/index.js';

const startServer = async () => {
  try {
    // Paso A: Verificar la conexión
    await testConnection();

    // Paso B: Crear tablas (si no existen)
    // Con { force: true } se eliminan las tablas y se crean de nuevo
    // Con { alter: true } se modifican las tablas existentes
    await sequelize.sync({ force: false });
    console.log('✅ Tablas sincronizadas');

    // Paso C: Abrir el puerto
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 App corriendo en localhost:${PORT}`);
      console.log(`Base de datos ${process.env.DB_NAME} lista y corriendo en Oracle Cloud`)
    });
  } catch (error) {
    console.error('💥 Error fatal:', error);
  }
};

startServer();