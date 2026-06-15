import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Producto = sequelize.define('Producto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  imagen: {
    type: DataTypes.STRING(255)
  },
  idCategoria: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idCreacion: {
    type: DataTypes.INTEGER
  },
  idActualizacion: {
    type: DataTypes.INTEGER
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fechaActualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Producto',
  timestamps: false
});

export default Producto;
