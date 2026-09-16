import app from './src/app.js';
import { sequelize, testConnection } from './src/config/database.js';
import './src/models/index.js';

const startServer = async () => {
  try {
    await testConnection();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 App corriendo en localhost:${PORT}`);
    });
  } catch (error) {
    console.error('💥 Error fatal:', error);
  }
};

startServer();