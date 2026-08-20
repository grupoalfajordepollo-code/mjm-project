import Imagenes from "./Imagenes.js";
import Administrador from "./Administrador.js";
import Usuario from "./Usuario.js";
import Domicilio from "./Domicilio.js";
import Categoria from "./Categoria.js";
import Producto from "./Producto.js";
import Carrito from "./Carrito.js";
import ItemxCarrito from "./ItemxCarrito.js";
import Pedido from "./Pedido.js";
import ItemxPedido from "./ItemxPedido.js";
import Pago from "./Pago.js";


// Relaciones de Usuario y Domicilio
Usuario.hasMany(Domicilio, {
  foreignKey: "idUsuario",
  as: "domicilios",
});

Domicilio.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  as: "usuario",
});


// Relaciones de Usuario y Carrito
Usuario.hasOne(Carrito, {
  foreignKey: "idUsuario",
  as: "carrito",
});

Carrito.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  as: "usuario",
});


// Relaciones de Usuario y Pedido
Usuario.hasMany(Pedido, {
  foreignKey: "idUsuario",
  as: "pedidos",
});

Pedido.belongsTo(Usuario, {
  foreignKey: "idUsuario",
  as: "usuario",
});


// Relaciones de Producto y Categoria
Categoria.hasMany(Producto, {
  foreignKey: "idCategoria",
  as: "productos",
});

Producto.belongsTo(Categoria, {
  foreignKey: "idCategoria",
  as: "categoria",
});


// Relaciones de Producto y Administrador
Administrador.hasMany(Producto, {
  foreignKey: "idAdministrador",
  as: "productos",
});

Producto.belongsTo(Administrador, {
  foreignKey: "idAdministrador",
  as: "administrador",
});


// Relaciones de Producto e Imagenes
Imagenes.hasMany(Producto, {
  foreignKey: "idImagen",
  as: "productos",
});

Producto.belongsTo(Imagenes, {
  foreignKey: "idImagen",
  as: "imagen",
});


// Relaciones de Carrito
Carrito.hasMany(ItemxCarrito, {
  foreignKey: "idCarrito",
  as: "items",
});

ItemxCarrito.belongsTo(Carrito, {
  foreignKey: "idCarrito",
  as: "carrito",
});

Producto.hasMany(ItemxCarrito, {
  foreignKey: "idProducto",
  as: "itemsCarrito",
});

ItemxCarrito.belongsTo(Producto, {
  foreignKey: "idProducto",
  as: "producto",
});


// Relaciones de Pedido
Pedido.hasMany(ItemxPedido, {
  foreignKey: "idPedido",
  as: "items",
});

ItemxPedido.belongsTo(Pedido, {
  foreignKey: "idPedido",
  as: "pedido",
});

Producto.hasMany(ItemxPedido, {
  foreignKey: "idProducto",
  as: "itemsPedido",
});

ItemxPedido.belongsTo(Producto, {
  foreignKey: "idProducto",
  as: "producto",
});


// Relaciones de Pedido y Pago
Pedido.hasOne(Pago, {
  foreignKey: "idPedido",
  as: "pago",
});

Pago.belongsTo(Pedido, {
  foreignKey: "idPedido",
  as: "pedido",
});


export {
  Administrador,
  Usuario,
  Domicilio,
  Categoria,
  Producto,
  Imagenes,
  Carrito,
  ItemxCarrito,
  Pedido,
  ItemxPedido,
  Pago,
};

