import ItemxCarrito from '../src/models/ItemxCarrito.js';
import Carrito from '../src/models/Carrito.js';
import Producto from '../src/models/Producto.js';

const items = [
  { email: 'juan@mail.com', producto: 'Organizador Apex', cantidad: 2 },
  { email: 'juan@mail.com', producto: 'Kit Engranajes Básicos', cantidad: 1 },
  { email: 'maria@mail.com', producto: 'Florero Voronoi', cantidad: 3 },
];

export default async function seedItemsCarrito() {
  for (const i of items) {
    const usuario = (await import('../src/models/Usuario.js')).default;
    const u = await usuario.findOne({ where: { email: i.email } });
    if (!u) { console.log(`  SKIP: Usuario ${i.email} no encontrado`); continue; }

    const carrito = await Carrito.findOne({ where: { idUsuario: u.id } });
    if (!carrito) { console.log(`  SKIP: Carrito de ${i.email} no encontrado`); continue; }

    const producto = await Producto.findOne({ where: { nombre: i.producto } });
    if (!producto) { console.log(`  SKIP: Producto ${i.producto} no encontrado`); continue; }

    const subtotal = Number(producto.precio) * i.cantidad;

    const hasProducto = await carrito.hasProducto(producto);
    if (!hasProducto) {
      await carrito.addProducto(producto, {
        through: {
          cantidad: i.cantidad,
          precioUnitario: producto.precio,
          subtotal
        }
      });
      console.log(`  INSERTADO: ItemCarrito ${i.producto} x${i.cantidad} (${i.email})`);
    } else {
      console.log(`  YA EXISTE: ItemCarrito ${i.producto} x${i.cantidad} (${i.email})`);
    }
  }
}
