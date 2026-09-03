import Producto from '../src/models/Producto.js';
import Categoria from '../src/models/Categoria.js';
import Administrador from '../src/models/Administrador.js';

const productos = [
  { nombre: 'Organizador Apex', categoria: 'branding', precio: 4500, stock: 145, descripcion: 'Organizador de escritorio impreso en 3D' },
  { nombre: 'Engranaje Helicoidal Pro-3', categoria: 'hobbie', precio: 1250.50, stock: 8, descripcion: 'Engranaje helicoidal de alta precisión' },
  { nombre: 'Florero Voronoi', categoria: 'bazar', precio: 3200, stock: 50, descripcion: 'Florero decorativo con estructura voronoi' },
  { nombre: 'Gabinete MK-Z', categoria: 'hobbie', precio: 12000, stock: 42, descripcion: 'Gabinete para electrónica personalizado' },
  { nombre: 'Dragón Articulado', categoria: 'juguetes', precio: 5800, stock: 12, descripcion: 'Figura de dragón con articulaciones móviles' },
  { nombre: 'Soporte Monitor VESA', categoria: 'branding', precio: 8500, stock: 35, descripcion: 'Soporte adjustable para monitores VESA' },
  { nombre: 'Lámpara Lunar 3D', categoria: 'bazar', precio: 6200, stock: 3, descripcion: 'Lámpara con forma de luna en PLA' },
  { nombre: 'Kit Engranajes Básicos', categoria: 'hobbie', precio: 2100, stock: 150, descripcion: 'Kit de engranajes para proyectos de ingeniería' },
];

export default async function seedProductos() {
  for (const p of productos) {
    const cat = await Categoria.findOne({ where: { nombre: p.categoria } });
    if (!cat) { console.log(`  SKIP: Categoría ${p.categoria} no encontrada para producto ${p.nombre}`); continue; }

    const admin = await Administrador.findOne({ where: { email: 'admin@mail.com' } });
    if (!admin) { console.log(`  SKIP: Administrador no encontrado para producto ${p.nombre}`); continue; }

    const [instance, created] = await Producto.findOrCreate({
      where: { nombre: p.nombre },
      defaults: { nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, idCategoria: cat.id, idAdministrador: admin.id, fechaAdmin: new Date() },
    });
    console.log(`  ${created ? 'INSERTADO' : 'YA EXISTE'}: Producto ${instance.nombre}`);
  }
}
