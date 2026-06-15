import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ItemxPedido = sequelize.define('ItemxPedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  tableName: 'ItemxPedido',
  timestamps: false
});

export default ItemxPedido;
