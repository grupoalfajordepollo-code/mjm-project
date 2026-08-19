import { sequelize, testConnection } from '../src/config/database.js';
import '../src/models/index.js';

import seedUsuarios from './usuarios.js';
import seedAdministradores from './administradores.js';
import seedCategorias from './categorias.js';
import seedTelefonos from './telefonos.js';
import seedDomicilios from './domicilios.js';
import seedProductos from './productos.js';
import seedCarritos from './carritos.js';
import seedItemsCarrito from './itemsCarrito.js';
import seedPedidos from './pedidos.js';
import seedItemsPedido from './itemsPedido.js';
import seedPagos from './pagos.js';

const seeders = [
  { name: 'Usuarios',        fn: seedUsuarios },
  { name: 'Administradores', fn: seedAdministradores },
  { name: 'Categorías',      fn: seedCategorias },
  { name: 'Teléfonos',       fn: seedTelefonos },
  { name: 'Domicilios',      fn: seedDomicilios },
  { name: 'Productos',       fn: seedProductos },
  { name: 'Carritos',        fn: seedCarritos },
  { name: 'ItemsCarrito',    fn: seedItemsCarrito },
  { name: 'Pedidos',         fn: seedPedidos },
  { name: 'ItemsPedido',     fn: seedItemsPedido },
  { name: 'Pagos',           fn: seedPagos },
];

async function run() {
  try {
    await testConnection();
    await sequelize.sync({ force: false });

    console.log('\n🌱 Iniciando seeders...\n');

    for (const s of seeders) {
      console.log(`▶ ${s.name}:`);
      await s.fn();
      console.log('');
    }

    console.log('✅ Seeders ejecutados correctamente.\n');
  } catch (error) {
    console.error('💥 Error en seeders:', error);
  } finally {
    await sequelize.close();
  }
}

run();
