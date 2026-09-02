import  { useState } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

// 1. Mock de datos basados en la estructura de tu tabla SQL
const mockProductos = [
  {
    id: 1,
    nombre: 'Organizador Apex',
    precio: 4500.00,
    stock: 145,
    idCategoria: 1, // Supongamos 1 = Branding
    categoriaNombre: 'Branding',
    fechaCreacion: '24 Oct, 2024',
  },
  {
    id: 2,
    nombre: 'Engranaje Helicoidal Pro-3',
    precio: 1250.50,
    stock: 8,
    idCategoria: 4, // Supongamos 4 = Repuestos
    categoriaNombre: 'Repuestos',
    fechaCreacion: '23 Oct, 2024',
  },
  {
    id: 3,
    nombre: 'Florero Voronoi',
    precio: 3200.00,
    stock: 0,
    idCategoria: 2, // Supongamos 2 = Bazar
    categoriaNombre: 'Bazar',
    fechaCreacion: '22 Oct, 2024',
  },
  {
    id: 4,
    nombre: 'Gabinete MK-Z',
    precio: 12000.00,
    stock: 42,
    idCategoria: 3, // Supongamos 3 = Hobbie
    categoriaNombre: 'Hobbie',
    fechaCreacion: '22 Oct, 2024',
  },
  {
    id: 5,
    nombre: 'Dragón Articulado',
    precio: 5800.00,
    stock: 12,
    idCategoria: 3, 
    categoriaNombre: 'Juguetes',
    fechaCreacion: '21 Oct, 2024',
  }
];

const ProductManagement = ({ setVistaActiva }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Función para determinar el estilo del badge según el INT del stock
  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[11px] font-bold rounded-md">Agotado</span>;
    }
    if (stock <= 10) {
      return <span className="px-2.5 py-1 bg-yellow-50 text-yellow-600 text-[11px] font-bold rounded-md">Bajo Stock</span>;
    }
    return <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[11px] font-bold rounded-md">En Stock</span>;
  };

  return (
    <main className="flex-1 bg-[#fcfdfe] overflow-y-auto font-space">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Gestión de Productos
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Supervisión y control de inventario en tiempo real.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e6d5cc] text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={16} strokeWidth={2.5} />
              Exportar CSV
            </button>
            <button onClick={() => setVistaActiva('crear')} className="flex items-center gap-2 px-5 py-2.5 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
              <Plus size={18} strokeWidth={2.5} />
              Nuevo Producto
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-[#e6d5cc] rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Productos</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-black text-gray-900">1,284</h3>
              <span className="text-green-500 text-xs font-bold mb-1.5 flex items-center">
                +12% este mes
              </span>
            </div>
          </div>
          
          <div className="bg-white border border-[#e6d5cc] rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bajo Stock / Agotados</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-black text-gray-900">42</h3>
              <span className="text-red-500 text-xs font-bold mb-1.5 flex items-center">
                Requiere atención
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#e6d5cc] rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Valor del Inventario</p>
            <h3 className="text-3xl font-black text-gray-900">$2.45M</h3>
            <p className="text-gray-400 text-xs font-medium mt-1">Capital inmovilizado</p>
          </div>
        </div>

        <div className="bg-white border border-[#e6d5cc] rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
          
          <div className="p-4 border-b border-[#e6d5cc] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#fcfdfe]">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por ID o nombre de producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#e6d5cc] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="p-2 text-gray-500 hover:text-[#B02F00] hover:bg-[#fff5f2] rounded-lg transition-colors border border-transparent hover:border-[#ffdbcc]">
                <Filter size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-[#B02F00] hover:bg-[#fff5f2] rounded-lg transition-colors border border-transparent hover:border-[#ffdbcc]">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfdfe] border-b border-[#e6d5cc]">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">ID Producto</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Nombre</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Categoría</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Precio</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Stock</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Agregado</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6d5cc]">
                {mockProductos.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                      #PROD-{prod.id.toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {prod.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {prod.categoriaNombre}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                      ${prod.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                      {prod.stock} un.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStockBadge(prod.stock)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {prod.fechaCreacion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="p-1.5 text-gray-400 hover:text-[#B02F00] transition-colors rounded">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#e6d5cc] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#fcfdfe]">
            <p className="text-xs font-medium text-gray-500">
              Mostrando <span className="font-bold text-gray-900">1-5</span> de 1,284 productos
            </p>
            
            <div className="flex items-center gap-1">
              <button className="p-1.5 border border-[#e6d5cc] rounded-md text-gray-400 hover:bg-gray-50 disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
              <button className="px-3 py-1.5 bg-[#B02F00] text-white text-xs font-bold rounded-md">
                1
              </button>
              <button className="px-3 py-1.5 border border-[#e6d5cc] text-gray-600 text-xs font-bold rounded-md hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1.5 border border-[#e6d5cc] text-gray-600 text-xs font-bold rounded-md hover:bg-gray-50">
                3
              </button>
              <button className="p-1.5 border border-[#e6d5cc] rounded-md text-gray-600 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default ProductManagement;