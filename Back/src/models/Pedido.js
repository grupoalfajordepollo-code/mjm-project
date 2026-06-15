import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fechaPedido: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(50),
    defaultValue: 'Pendiente'
  }
}, {
  tableName: 'Pedido',
  timestamps: false
});

export default Pedido;
