import Categoria from '../src/models/Categoria.js';

const categorias = [
  { nombre: 'Impresión 3D', descripcion: 'Objetos impresos en 3D' },
  { nombre: 'Filamento', descripcion: 'Rollos de filamento para impresión' },
  { nombre: 'Repuestos', descripcion: 'Repuestos y componentes' },
  { nombre: 'Accesorios', descripcion: 'Accesorios varios' },
  {nombre: 'Juguetes', descripcion: 'Articulos Divertidos'}
];

export default async function seedCategorias() {
  for (const c of categorias) {
    const [instance, created] = await Categoria.findOrCreate({ where: { nombre: c.nombre }, defaults: c });
    console.log(`  ${created ? 'INSERTADO' : 'YA EXISTE'}: Categoría ${instance.nombre}`);
  }
}
