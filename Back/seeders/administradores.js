import Administrador from '../src/models/Administrador.js';

const admins = [
  { nombre: 'Admin', apellido: 'Principal', email: 'admin@mail.com', password: 'Admin123!' },
];

export default async function seedAdministradores() {
  for (const a of admins) {
    const [instance, created] = await Administrador.findOrCreate({ where: { email: a.email }, defaults: a });
    console.log(`  ${created ? 'INSERTADO' : 'YA EXISTE'}: Administrador ${instance.email}`);
  }
}
