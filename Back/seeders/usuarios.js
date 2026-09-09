import Usuario from '../src/models/Usuario.js';

const usuarios = [
  { nombre: 'Juan', apellido: 'Pérez', email: 'juan@mail.com', password: '!Juan1234' },
  { nombre: 'María', apellido: 'López', email: 'maria@mail.com', password: '!Maria1234' },
  { nombre: 'Carlos', apellido: 'García', email: 'carlos@mail.com', password: '!Carlos1234' },
];

export default async function seedUsuarios() {
  for (const u of usuarios) {
    const [instance, created] = await Usuario.findOrCreate({ where: { email: u.email }, defaults: u });
    if (!created) {
      const isBcrypt = instance.password.startsWith('$2a$') || instance.password.startsWith('$2b$');
      if (!isBcrypt) {
        instance.password = u.password;
        await instance.save();
        console.log(`  ACTUALIZADO (HASHED): Usuario ${instance.email}`);
      } else {
        console.log(`  YA EXISTE: Usuario ${instance.email}`);
      }
    } else {
      console.log(`  INSERTADO: Usuario ${instance.email}`);
    }
  }
}
