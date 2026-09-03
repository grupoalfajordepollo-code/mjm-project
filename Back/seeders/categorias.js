import Categoria from '../src/models/Categoria.js';

const categorias = [
  { nombre: 'branding', descripcion: 'Productos de marca y promoción' },
  { nombre: 'bazar', descripcion: 'Artículos para el hogar y decoración' },
  { nombre: 'juguetes', descripcion: 'Juguetes y figuras decorativas' },
  { nombre: 'hobbie', descripcion: 'Repuestos, accesorios y componentes' },
];

export default async function seedCategorias() {
  for (const c of categorias) {
    const [instance, created] = await Categoria.findOrCreate({ where: { nombre: c.nombre }, defaults: c });
    console.log(`  ${created ? 'INSERTADO' : 'YA EXISTE'}: Categoría ${instance.nombre}`);
  }
}
