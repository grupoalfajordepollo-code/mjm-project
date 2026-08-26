import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import bcrypt from "bcryptjs";

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,

      validate: {
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/,
          msg: "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un carácter especial",
        },
      },
    },

    fechaRegistro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    telefono: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "Usuario",
    timestamps: false,

    hooks: {
      beforeSave: async (usuario) => {
        if (usuario.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
  }
);

Usuario.prototype.comprobarPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default Usuario;

