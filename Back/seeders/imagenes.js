import Imagenes from '../src/models/Imagenes.js';
import Producto from '../src/models/Producto.js';

const imagenes = [
  { producto: 'Organizador Apex', imagen: 'MJMI/Home/Product1.webp', descripcion: 'Organizador de escritorio' },
  { producto: 'Florero Voronoi', imagen: 'MJMI/Home/Product2.webp', descripcion: 'Florero decorativo voronoi' },
  { producto: 'Dragón Articulado', imagen: 'MJMI/Home/Product3.webp', descripcion: 'Figura de dragón articulado' },
  { producto: 'Gabinete MK-Z', imagen: 'MJMI/Home/Product4.webp', descripcion: 'Gabinete para electrónica' },
];

export default async function seedImagenes() {
  for (const i of imagenes) {
    const producto = await Producto.findOne({ where: { nombre: i.producto } });
    if (!producto) { console.log(`  SKIP: Producto ${i.producto} no encontrado para imagen`); continue; }

    const [instance, created] = await Imagenes.findOrCreate({
      where: { imagen: i.imagen },
      defaults: { imagen: i.imagen, descripcion: i.descripcion },
    });

    if (!producto.idImagen) {
      await producto.update({ idImagen: instance.id });
      console.log(`  ASIGNADA: Imagen ${instance.id} a producto ${producto.nombre}`);
    } else {
      console.log(`  YA EXISTE: Imagen para ${producto.nombre}`);
    }
  }
}
