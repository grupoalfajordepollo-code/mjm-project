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

    imagen: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "Imagenes",
    timestamps: false,
  }
);

export default Imagenes;

