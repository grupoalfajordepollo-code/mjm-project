import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    idImagen: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    idCategoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    idAdministrador: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    fechaAdmin: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Producto",
    timestamps: true,
    paranoid: true,
  }
);

export default Producto;

