import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Pago = sequelize.define('Pago', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  metodoPago: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  estadoPago: {
    type: DataTypes.STRING(50)
  },
  fechaPago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'Pago',
  timestamps: false
});

export default Pago;
