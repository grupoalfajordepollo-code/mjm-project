import Producto from '../src/models/Producto.js';
import Categoria from '../src/models/Categoria.js';

const productos = [
  { nombre: 'Figura de dragón', categoria: 'Impresión 3D', precio: 2500, stock: 10, descripcion: 'Figura decorativa de dragón en PLA' },
  { nombre: 'Estuche para celular', categoria: 'Impresión 3D', precio: 1800, stock: 25, descripcion: 'Estuche protector para celular genérico' },
  { nombre: 'Filamento PLA 1kg', categoria: 'Filamento', precio: 3200, stock: 50, descripcion: 'Rollo de PLA 1.75mm color negro' },
  { nombre: 'Filamento PETG 1kg', categoria: 'Filamento', precio: 3800, stock: 30, descripcion: 'Rollo de PETG 1.75mm transparente' },
  { nombre: 'Boquilla 0.4mm', categoria: 'Repuestos', precio: 800, stock: 100, descripcion: 'Boquilla de brass para hotend estándar' },
  { nombre: 'Correa GT2', categoria: 'Repuestos', precio: 450, stock: 40, descripcion: 'Correa dentada GT2 6mm' },
  { nombre: 'Base de cama adhesiva', categoria: 'Accesorios', precio: 1200, stock: 20, descripcion: 'Superficie adhesiva para cama de impresión' },
  { nombre: 'Pinza de calibración', categoria: 'Accesorios', precio: 600, stock: 35, descripcion: 'Pinza metálica para nivelar la cama' },
];

export default async function seedProductos() {
  for (const p of productos) {
    const cat = await Categoria.findOne({ where: { nombre: p.categoria } });
    if (!cat) { console.log(`  SKIP: Categoría ${p.categoria} no encontrada para producto ${p.nombre}`); continue; }

    const admin = await (await import('../src/models/Administrador.js')).default.findOne({ where: { email: 'admin@mail.com' } });
    if (!admin) { console.log(`  SKIP: Administrador no encontrado para producto ${p.nombre}`); continue; }

    const [instance, created] = await Producto.findOrCreate({
      where: { nombre: p.nombre },
      defaults: { nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, idCategoria: cat.id, idAdministrador: admin.id, fechaAdmin: new Date() },
    });
    console.log(`  ${created ? 'INSERTADO' : 'YA EXISTE'}: Producto ${instance.nombre}`);
  }
}
