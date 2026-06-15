import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ItemxCarrito = sequelize.define('ItemxCarrito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idCarrito: {
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
  tableName: 'ItemxCarrito',
  timestamps: false
});

export default ItemxCarrito;
