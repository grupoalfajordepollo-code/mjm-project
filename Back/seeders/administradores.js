import Administrador from '../src/models/Administrador.js';

const admins = [
  { nombre: 'Admin', apellido: 'Principal', email: 'admin@mail.com', password: '!Admin123' },
];

export default async function seedAdministradores() {
  for (const a of admins) {
    const [instance, created] = await Administrador.findOrCreate({ where: { email: a.email }, defaults: a });
    if (!created) {
      const isBcrypt = instance.password.startsWith('$2a$') || instance.password.startsWith('$2b$');
      if (!isBcrypt) {
        instance.password = a.password;
        await instance.save();
        console.log(`  ACTUALIZADO (HASHED): Administrador ${instance.email}`);
      } else {
        console.log(`  YA EXISTE: Administrador ${instance.email}`);
      }
    } else {
      console.log(`  INSERTADO: Administrador ${instance.email}`);
    }
  }
}
