import Pedido from '../src/models/Pedido.js';
import Usuario from '../src/models/Usuario.js';

const pedidos = [
  { email: 'juan@mail.com', total: 8200, estado: 'Entregado' },
  { email: 'maria@mail.com', total: 5400, estado: 'Enviado' },
  { email: 'carlos@mail.com', total: 3200, estado: 'Pendiente' },
];

export default async function seedPedidos() {
  for (const p of pedidos) {
    const usuario = await Usuario.findOne({ where: { email: p.email } });
    if (!usuario) { console.log(`  SKIP: Usuario ${p.email} no encontrado para pedido`); continue; }

    const [instance, created] = await Pedido.findOrCreate({
      where: { idUsuario: usuario.id, total: p.total },
      defaults: { idUsuario: usuario.id, total: p.total, estado: p.estado },
    });
    console.log(`  ${created ? 'INSERTADO' : 'YA EXISTE'}: Pedido #${instance.id} de ${p.email} ($${p.total})`);
  }
}
