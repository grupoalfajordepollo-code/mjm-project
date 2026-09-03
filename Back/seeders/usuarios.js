import Usuario from '../src/models/Usuario.js';

const usuarios = [
  { nombre: 'Juan', apellido: 'Pérez', email: 'juan@mail.com', password: 'Juan1234!' },
  { nombre: 'María', apellido: 'López', email: 'maria@mail.com', password: 'Maria1234!' },
  { nombre: 'Carlos', apellido: 'García', email: 'carlos@mail.com', password: 'Carlos1234!' },
];

export default async function seedUsuarios() {
  for (const u of usuarios) {
    const [instance, created] = await Usuario.findOrCreate({ where: { email: u.email }, defaults: u });
    console.log(`  ${created ? 'INSERTADO' : 'YA EXISTE'}: Usuario ${instance.email}`);
  }
}
