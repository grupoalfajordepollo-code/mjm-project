import { sequelize, testConnection } from './src/config/database.js';
import './src/models/index.js';

const resetDB = async () => {
  try {
    await testConnection();
    console.log('🗑️  Eliminando y recreando tablas...');
    await sequelize.sync({ force: true });
    console.log('✅ Tablas recreadas desde cero');
    process.exit(0);
  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
};

resetDB();
