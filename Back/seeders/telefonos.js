import Telefono from '../src/models/Telefono.js';
import Usuario from '../src/models/Usuario.js';

const telefonos = [
  { email: 'juan@mail.com', caracteristica: '261', numero: '4441234', tipo: 'móvil' },
  { email: 'maria@mail.com', caracteristica: '261', numero: '5556789', tipo: 'móvil' },
  { email: 'carlos@mail.com', caracteristica: '11', numero: '6667788', tipo: 'fijo' },
];

export default async function seedTelefonos() {
  for (const t of telefonos) {
    const usuario = await Usuario.findOne({ where: { email: t.email } });
    if (!usuario) { console.log(`  SKIP: Usuario ${t.email} no encontrado para teléfono`); continue; }

    const [instance, created] = await Telefono.findOrCreate({
      where: { idUsuario: usuario.id, numero: t.numero },
      defaults: { caracteristica: t.caracteristica, tipo: t.tipo, idUsuario: usuario.id },
    });
    console.log(`  ${created ? 'INSERTADO' : 'YA EXISTE'}: Teléfono ${instance.numero} (${t.email})`);
  }
}
