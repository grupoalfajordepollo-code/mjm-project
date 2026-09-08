import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Pencil,
  Trash2
} from 'lucide-react';
import { obtenerProductos, eliminarProducto } from '../services/productoService';

const ProductManagement = ({ onCrear, onEditar }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await obtenerProductos();
      setProductos(res.data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await eliminarProducto(id);
        setProductos((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error('Error al eliminar producto:', err);
        alert('No se pudo eliminar el producto.');
      }
    }
  };

  const handleEditar = (id) => {
    onEditar(id);
  };

  const productosFiltrados = productos.filter((prod) =>
    prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.id.toString().includes(searchTerm)
  );

  const totalItems = productosFiltrados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = productosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[11px] font-bold rounded-md">Agotado</span>;
    if (stock <= 10) return <span className="px-2.5 py-1 bg-yellow-50 text-yellow-600 text-[11px] font-bold rounded-md">Bajo Stock</span>;
    return <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[11px] font-bold rounded-md">En Stock</span>;
  };

  return (
    <main className="flex-1 bg-[#fcfdfe] font-space p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Productos</h1>
            <p className="text-sm text-gray-500 mt-1">Supervisión y control de inventario en tiempo real.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e6d5cc] text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={16} strokeWidth={2.5} />
              Exportar CSV
            </button>
            <button 
              onClick={onCrear}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              <Plus size={18} strokeWidth={2.5} />
              Nuevo Producto
            </button>
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 border border-[#e6d5cc] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="p-2 text-gray-500 hover:text-[#B02F00] hover:bg-[#fff5f2] rounded-lg transition-colors border border-transparent hover:border-[#ffdbcc]"><Filter size={18} /></button>
              <button 
                onClick={fetchProductos}
                className="p-2 text-gray-500 hover:text-[#B02F00] hover:bg-[#fff5f2] rounded-lg transition-colors border border-transparent hover:border-[#ffdbcc]"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="px-6 py-12 text-center text-sm text-gray-500">Cargando productos...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fcfdfe] border-b border-[#e6d5cc]">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">ID Producto</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Nombre</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Categoría</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Precio</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Stock</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Estado</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6d5cc]">
                  {currentItems.length > 0 ? (
                    currentItems.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">#{prod.id.toString().padStart(3, '0')}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{prod.nombre}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{prod.categoria?.nombre || '-'}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">${Number(prod.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">{prod.stock} un.</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStockBadge(prod.stock)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          
                          <div className="flex justify-end items-center gap-1">
                            <button 
                              onClick={() => handleEditar(prod.id)}
                              title="Editar Producto"
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                            >
                              <Pencil size={18} strokeWidth={2} />
                            </button>
                            
                            <button 
                              onClick={() => handleEliminar(prod.id)}
                              title="Eliminar Producto"
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                            >
                              <Trash2 size={18} strokeWidth={2} />
                            </button>
                          </div>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                        No se encontraron productos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 border-t border-[#e6d5cc] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#fcfdfe]">
            <p className="text-xs font-medium text-gray-500">
              Mostrando <span className="font-bold text-gray-900">
                {totalItems === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}
              </span> de <span className="font-bold text-gray-900">{totalItems}</span> productos
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-[#e6d5cc] rounded-md text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-[#B02F00] text-white' 
                          : 'border border-[#e6d5cc] text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-[#e6d5cc] rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductManagement;
