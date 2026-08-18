import Carrito from '../src/models/Carrito.js';
import Usuario from '../src/models/Usuario.js';

const carritos = [
  { email: 'juan@mail.com' },
  { email: 'maria@mail.com' },
];

export default async function seedCarritos() {
  for (const c of carritos) {
    const usuario = await Usuario.findOne({ where: { email: c.email } });
    if (!usuario) { console.log(`  SKIP: Usuario ${c.email} no encontrado para carrito`); continue; }

    const [instance, created] = await Carrito.findOrCreate({
      where: { idUsuario: usuario.id },
      defaults: { idUsuario: usuario.id },
    });
    console.log(`  ${created ? 'INSERTADO' : 'YA EXISTE'}: Carrito para ${c.email}`);
  }
}
