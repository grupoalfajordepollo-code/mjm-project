import ItemxPedido from '../src/models/ItemxPedido.js';
import Pedido from '../src/models/Pedido.js';
import Producto from '../src/models/Producto.js';
import Usuario from '../src/models/Usuario.js';

const items = [
  { email: 'juan@mail.com', totalPedido: 8200, producto: 'Figura de dragón', cantidad: 2 },
  { email: 'juan@mail.com', totalPedido: 8200, producto: 'Filamento PLA 1kg', cantidad: 1 },
  { email: 'maria@mail.com', totalPedido: 5400, producto: 'Estuche para celular', cantidad: 3 },
  { email: 'carlos@mail.com', totalPedido: 3200, producto: 'Filamento PETG 1kg', cantidad: 1 },
];

export default async function seedItemsPedido() {
  for (const i of items) {
    const u = await Usuario.findOne({ where: { email: i.email } });
    if (!u) { console.log(`  SKIP: Usuario ${i.email} no encontrado`); continue; }

    const pedido = await Pedido.findOne({ where: { idUsuario: u.id, total: i.totalPedido } });
    if (!pedido) { console.log(`  SKIP: Pedido de ${i.email} con total ${i.totalPedido} no encontrado`); continue; }

    const producto = await Producto.findOne({ where: { nombre: i.producto } });
    if (!producto) { console.log(`  SKIP: Producto ${i.producto} no encontrado`); continue; }

    const subtotal = Number(producto.precio) * i.cantidad;

    const hasProducto = await pedido.hasProducto(producto);
    if (!hasProducto) {
      await pedido.addProducto(producto, {
        through: {
          cantidad: i.cantidad,
          precioUnitario: producto.precio,
          subtotal
        }
      });
      console.log(`  INSERTADO: ItemPedido ${i.producto} x${i.cantidad} (${i.email})`);
    } else {
      console.log(`  YA EXISTE: ItemPedido ${i.producto} x${i.cantidad} (${i.email})`);
    }
  }
}
