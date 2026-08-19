import Pago from '../src/models/Pago.js';
import Pedido from '../src/models/Pedido.js';
import Usuario from '../src/models/Usuario.js';

const pagos = [
  { email: 'juan@mail.com', totalPedido: 8200, metodo: 'Tarjeta de crédito', estado: 'Aprobado', monto: 8200 },
  { email: 'maria@mail.com', totalPedido: 5400, metodo: 'Transferencia', estado: 'Aprobado', monto: 5400 },
];

export default async function seedPagos() {
  for (const p of pagos) {
    const u = await Usuario.findOne({ where: { email: p.email } });
    if (!u) { console.log(`  SKIP: Usuario ${p.email} no encontrado`); continue; }

    const pedido = await Pedido.findOne({ where: { idUsuario: u.id, total: p.totalPedido } });
    if (!pedido) { console.log(`  SKIP: Pedido de ${p.email} con total ${p.totalPedido} no encontrado`); continue; }

    const [instance, created] = await Pago.findOrCreate({
      where: { idPedido: pedido.id },
      defaults: { idPedido: pedido.id, metodoPago: p.metodo, estadoPago: p.estado, monto: p.monto },
    });
    console.log(`  ${created ? 'INSERTADO' : 'YA EXISTE'}: Pago Pedido #${pedido.id} - ${p.metodo} ($${p.monto})`);
  }
}
