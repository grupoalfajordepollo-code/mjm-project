import { sequelize, testConnection } from './src/config/database.js';
import './src/models/index.js';

const resetDB = async () => {
  try {
    await testConnection();
    console.log('🗑️  Eliminando y recreando tablas...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await sequelize.query('DROP TABLE IF EXISTS telefono;');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('✅ Tablas recreadas desde cero');
    process.exit(0);
  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
};

resetDB();
