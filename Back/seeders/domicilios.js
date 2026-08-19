import Domicilio from '../src/models/Domicilio.js';
import Usuario from '../src/models/Usuario.js';

const domicilios = [
  { email: 'juan@mail.com', calle: 'San Martín', numero: '123', ciudad: 'Mendoza', provincia: 'Mendoza', codigoPostal: '5500' },
  { email: 'maria@mail.com', calle: 'Belgrano', numero: '456', ciudad: 'Mendoza', provincia: 'Mendoza', codigoPostal: '5501' },
  { email: 'carlos@mail.com', calle: 'Rivadavia', numero: '789', ciudad: 'Ciudad de Buenos Aires', provincia: 'Buenos Aires', codigoPostal: '1000' },
];

export default async function seedDomicilios() {
  for (const d of domicilios) {
    const usuario = await Usuario.findOne({ where: { email: d.email } });
    if (!usuario) { console.log(`  SKIP: Usuario ${d.email} no encontrado para domicilio`); continue; }

    const [instance, created] = await Domicilio.findOrCreate({
      where: { idUsuario: usuario.id, calle: d.calle, numero: d.numero },
      defaults: { calle: d.calle, numero: d.numero, ciudad: d.ciudad, provincia: d.provincia, codigoPostal: d.codigoPostal, idUsuario: usuario.id },
    });
    console.log(`  ${created ? 'INSERTADO' : 'YA EXISTE'}: Domicilio ${instance.calle} ${instance.numero} (${d.email})`);
  }
}
