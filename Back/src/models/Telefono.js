import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Telefono = sequelize.define('Telefono', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  caracteristica: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Telefono',
  timestamps: false
});

export default Telefono;
