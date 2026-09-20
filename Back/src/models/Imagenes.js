import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Imagenes = sequelize.define(
  "Imagenes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    idProducto:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull:false,
      defaultValue: 0,
    },

    imagen: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    hash: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    },

    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "Imagenes",
    timestamps: true,
    paranoid: true,
  }
);

export default Imagenes;

