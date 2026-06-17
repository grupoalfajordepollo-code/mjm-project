import Administrador from './Administrador.js';
import Usuario from './Usuario.js';
import Telefono from './Telefono.js';
import Domicilio from './Domicilio.js';
import Categoria from './Categoria.js';
import Producto from './Producto.js';
import Carrito from './Carrito.js';
import ItemxCarrito from './ItemxCarrito.js';
import Pedido from './Pedido.js';
import ItemxPedido from './ItemxPedido.js';
import Pago from './Pago.js';

// Relaciones de Usuario
Usuario.hasMany(Telefono, {
  foreignKey: 'idUsuario',
  as: 'telefonos'
});
Telefono.belongsTo(Usuario, {
  foreignKey: 'idUsuario'
});

Usuario.hasMany(Domicilio, {
  foreignKey: 'idUsuario',
  as: 'domicilios'
});
Domicilio.belongsTo(Usuario, {
  foreignKey: 'idUsuario'
});

Usuario.hasOne(Carrito, {
  foreignKey: 'idUsuario',
  as: 'carrito'
});

Carrito.belongsTo(Usuario, {
  foreignKey: 'idUsuario',
  as: 'usuario'
});

Usuario.hasMany(Pedido, {
  foreignKey: 'idUsuario',
  as: 'pedidos'
});

Pedido.belongsTo(Usuario, {
  foreignKey: 'idUsuario',
  as: 'usuario'
});

// Relaciones de Producto y Categoría
Categoria.hasMany(Producto, {
  foreignKey: 'idCategoria',
  as: 'productos'
});

Producto.belongsTo(Categoria, {
  foreignKey: 'idCategoria',
  as: 'categoria'
});

// Relaciones de Carrito
Carrito.hasMany(ItemxCarrito, {
  foreignKey: 'idCarrito',
  as: 'items'
});

ItemxCarrito.belongsTo(Carrito, {
  foreignKey: 'idCarrito',
  as: 'carrito'
});

Producto.hasMany(ItemxCarrito, {
  foreignKey: 'idProducto'
});

ItemxCarrito.belongsTo(Producto, {
  foreignKey: 'idProducto',
  as: 'producto'
});

// Relaciones de Pedido
Pedido.hasMany(ItemxPedido, {
  foreignKey: 'idPedido',
  as: 'items'
});

ItemxPedido.belongsTo(Pedido, {
  foreignKey: 'idPedido',
  as: 'pedido'
});

Producto.hasMany(ItemxPedido, {
  foreignKey: 'idProducto'
});

ItemxPedido.belongsTo(Producto, {
  foreignKey: 'idProducto',
  as: 'producto'
});

Pedido.hasOne(Pago, {
  foreignKey: 'idPedido',
  as: 'pago'
});

Pago.belongsTo(Pedido, {
  foreignKey: 'idPedido',
  as: 'pedido'
});

export {
  Administrador,
  Usuario,
  Telefono,
  Domicilio,
  Categoria,
  Producto,
  Carrito,
  ItemxCarrito,
  Pedido,
  ItemxPedido,
  Pago
};

