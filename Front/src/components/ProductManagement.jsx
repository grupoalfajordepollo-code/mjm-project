import { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  Package,
  AlertTriangle,
  Layers,
  XCircle,
  PackageSearch,
  X
} from 'lucide-react';
import { obtenerProductos, eliminarProducto } from '../services/productoService';
import { getAsset } from '../utils/getAssetsUrl';

const ProductManagement = ({ onCrear, onEditar }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const [modal, setModal] = useState(null); // {tipo:'confirmar'|'error', titulo, mensaje, onConfirmar?}
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    if (!modal || borrando) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setModal(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, borrando]);

  const pedirEliminar = (prod) => {
    setModal({
      tipo: 'confirmar',
      titulo: 'Eliminar producto',
      mensaje: `¿Estás seguro de que deseas eliminar "${prod.nombre}"? Se quitará del catálogo. Sus fotos se conservan en el sistema.`,
      onConfirmar: () => confirmarEliminar(prod.id),
    });
  };

  const confirmarEliminar = async (id) => {
    setBorrando(true);
    try {
      await eliminarProducto(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      setModal(null);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setModal({
        tipo: 'error',
        titulo: 'No se pudo eliminar',
        mensaje: 'El producto no pudo eliminarse. Probá de nuevo en unos segundos.',
      });
    } finally {
      setBorrando(false);
    }
  };

  const handleEditar = (id) => {
    onEditar(id);
  };

  const productosFiltrados = productos.filter((prod) => {
    const matchNombre = (prod.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === 'todas' || (prod.categoria?.nombre || '') === categoriaFiltro;
    const stock = Number(prod.stock) || 0;
    const matchEstado =
      estadoFiltro === 'todos' ||
      (estadoFiltro === 'en-stock' && stock > 10) ||
      (estadoFiltro === 'bajo' && stock >= 1 && stock <= 10) ||
      (estadoFiltro === 'agotado' && stock === 0);
    return matchNombre && matchCategoria && matchEstado;
  });

  const hayFiltros = searchTerm !== '' || categoriaFiltro !== 'todas' || estadoFiltro !== 'todos';

  const limpiarFiltros = () => {
    setSearchTerm('');
    setCategoriaFiltro('todas');
    setEstadoFiltro('todos');
    setCurrentPage(1);
  };

  const categorias = [...new Set(productos.map((p) => p.categoria?.nombre).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'es'));

  const maxStock = Math.max(1, ...productos.map((p) => Number(p.stock) || 0));
  const totalProductos = productos.length;
  const bajoStockCount = productos.filter((p) => p.stock >= 1 && p.stock <= 10).length;
  const agotadosCount = productos.filter((p) => Number(p.stock) === 0).length;

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const getSortValue = (prod, field) => {
    switch (field) {
      case 'nombre':
        return (prod.nombre || '').toLowerCase();
      case 'categoria':
        return (prod.categoria?.nombre || '').toLowerCase();
      case 'precio':
        return Number(prod.precio) || 0;
      case 'stock':
        return Number(prod.stock) || 0;
      case 'estado':
        if (prod.stock === 0) return 0;
        if (prod.stock <= 10) return 1;
        return 2;
      default:
        return '';
    }
  };

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (!sortField) return 0;
    const valA = getSortValue(a, sortField);
    const valB = getSortValue(b, sortField);
    let comparison;
    if (typeof valA === 'number' && typeof valB === 'number') {
      comparison = valA - valB;
    } else {
      comparison = String(valA).localeCompare(String(valB), 'es');
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const renderSortButtons = (field) => {
    const isActive = sortField === field;
    const isAsc = isActive && sortDirection === 'asc';
    const isDesc = isActive && sortDirection === 'desc';
    return (
      <span className={`inline-flex shrink-0 items-center justify-center p-1 rounded-md transition-colors ${isActive ? 'bg-white text-[#B02F00]' : 'bg-white/15 text-white/80'}`}>
        {!isActive && <ChevronsUpDown size={14} strokeWidth={2.5} />}
        {isAsc && <ArrowUp size={14} strokeWidth={2.5} />}
        {isDesc && <ArrowDown size={14} strokeWidth={2.5} />}
      </span>
    );
  };

  const toggleSort = (field) => {
    if (sortField !== field) {
      handleSort(field, 'asc');
    } else {
      handleSort(field, sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  const renderSortableHeader = (label, field, sub) => {
    const isActive = sortField === field;
    const nextDirection = !isActive || sortDirection === 'desc' ? 'ascendente' : 'descendente';
    return (
      <button
        onClick={() => toggleSort(field)}
        title={`Ordenar por ${label}: ${nextDirection}`}
        aria-sort={!isActive ? 'none' : sortDirection === 'asc' ? 'ascending' : 'descending'}
        className={`inline-flex items-center gap-2 leading-none py-1 px-1 -mx-1 rounded-md transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${isActive ? 'text-white hover:bg-white/15' : 'text-white/75 hover:text-white hover:bg-white/15'}`}
      >
        {sub ? (
          <span className="flex flex-col items-start leading-tight">
            <span className="leading-none">{label}</span>
            <span className="text-[10px] font-semibold normal-case tracking-normal text-white/60 leading-tight">{sub}</span>
          </span>
        ) : (
          <span className="leading-none">{label}</span>
        )}
        {renderSortButtons(field)}
      </button>
    );
  };

  const totalItems = productosOrdenados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = productosOrdenados.slice(indexOfFirstItem, indexOfLastItem);

  const getStockMeta = (stock) => {
    const s = Number(stock) || 0;
    if (s === 0) return { label: 'AGOTADO', pill: 'border-red-400 bg-white text-red-700', dot: 'bg-red-600', bar: 'bg-red-600' };
    if (s <= 10) return { label: 'BAJO STOCK', pill: 'border-amber-500 bg-white text-amber-800', dot: 'bg-amber-500', bar: 'bg-amber-500' };
    return { label: 'EN STOCK', pill: 'border-emerald-600/50 bg-white text-emerald-700', dot: 'bg-emerald-600', bar: 'bg-emerald-600' };
  };

  const getInitials = (nombre) => {
    const parts = (nombre || '?').trim().split(/\s+/);
    return ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase();
  };

  const renderCategoryBadge = (nombre) => (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white bg-[#24272c] border border-[#24272c] rounded-[3px] whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-[1px] bg-[#ff5a2c] shrink-0" />
      {nombre || '—'}
    </span>
  );

  const cellTone = (field) => (sortField === field ? ' bg-[#B02F00]/[0.045]' : '');

  const formatMoney = (value) =>
    `$${Number(value || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

  return (
    <main className="flex-1 bg-[#fcfdfe] font-space p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Productos</h1>
              <p className="text-sm text-gray-500 mt-1">Supervisión y control de inventario en tiempo real.</p>
            </div>
          <div className="flex items-center gap-3">
            {/* <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e6d5cc] text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={16} strokeWidth={2.5} />
              Exportar CSV
            </button> */}
            <button 
              onClick={onCrear}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              <Plus size={18} strokeWidth={2.5} />
              Nuevo Producto
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-[#e6d5cc] rounded-2xl p-4 flex items-center gap-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)]">
            <div className="p-2.5 rounded-xl bg-[#FFF1EA] text-[#B02F00]">
              <Package size={20} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total productos</p>
              <p className="text-xl font-extrabold text-gray-900 tabular-nums leading-tight">{totalProductos}</p>
            </div>
          </div>
          <button
            onClick={() => { setEstadoFiltro((prev) => (prev === 'bajo' ? 'todos' : 'bajo')); setCurrentPage(1); }}
            title="Filtrar productos con bajo stock"
            className={`cursor-pointer text-left bg-white border rounded-2xl p-4 flex items-center gap-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] transition-colors ${estadoFiltro === 'bajo' ? 'border-[#B02F00] ring-2 ring-[#B02F00]/20' : 'border-[#e6d5cc] hover:border-[#B02F00]/40'}`}
          >
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle size={20} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Bajo stock</p>
              <p className="text-xl font-extrabold text-gray-900 tabular-nums leading-tight">{bajoStockCount}</p>
            </div>
          </button>
          <button
            onClick={() => { setEstadoFiltro((prev) => (prev === 'agotado' ? 'todos' : 'agotado')); setCurrentPage(1); }}
            title="Filtrar productos agotados"
            className={`cursor-pointer text-left bg-white border rounded-2xl p-4 flex items-center gap-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] transition-colors ${estadoFiltro === 'agotado' ? 'border-[#B02F00] ring-2 ring-[#B02F00]/20' : 'border-[#e6d5cc] hover:border-[#B02F00]/40'}`}
          >
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <XCircle size={20} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Agotados</p>
              <p className="text-xl font-extrabold text-gray-900 tabular-nums leading-tight">{agotadosCount}</p>
            </div>
          </button>
        </div>

        <div className="bg-white border border-[#e6d5cc] rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
          
          <div className="p-4 border-b border-[#e6d5cc] flex flex-col xl:flex-row xl:justify-between gap-3 bg-[#fcfdfe]">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative w-full sm:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-8 py-2 border border-[#e6d5cc] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                    title="Limpiar búsqueda"
                    className="cursor-pointer absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-[#B02F00] transition-colors"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>
              <div className="relative">
                <select
                  value={categoriaFiltro}
                  onChange={(e) => { setCategoriaFiltro(e.target.value); setCurrentPage(1); }}
                  className="cursor-pointer appearance-none w-full sm:w-auto pl-3 pr-9 py-2 border border-[#e6d5cc] rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-colors"
                >
                  <option value="todas">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={estadoFiltro}
                  onChange={(e) => { setEstadoFiltro(e.target.value); setCurrentPage(1); }}
                  className="cursor-pointer appearance-none w-full sm:w-auto pl-3 pr-9 py-2 border border-[#e6d5cc] rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-colors"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="en-stock">En stock</option>
                  <option value="bajo">Bajo stock</option>
                  <option value="agotado">Agotado</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hayFiltros && (
                <button
                  onClick={limpiarFiltros}
                  className="cursor-pointer px-3 py-2 text-xs font-bold text-[#B02F00] hover:bg-[#FFF1EA] rounded-lg transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
              <span
                title={hayFiltros ? `${totalItems} de ${totalProductos} productos` : `${totalItems} productos en total`}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 text-xs font-bold text-white bg-[#24272c] border border-[#31353b] rounded-full tabular-nums whitespace-nowrap shadow-sm"
              >
                <Layers size={13} strokeWidth={2.5} className="text-[#ff5a2c]" />
                {totalItems}{hayFiltros ? ` de ${totalProductos}` : ''} {totalItems === 1 ? 'resultado' : 'resultados'}
              </span>
              <button 
                onClick={fetchProductos}
                title="Actualizar datos"
                className="cursor-pointer p-2 text-gray-500 hover:text-[#B02F00] hover:bg-[#fff5f2] rounded-lg transition-colors border border-transparent hover:border-[#ffdbcc]"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#B02F00] border-b border-[#8a2500]">
                    {['Producto', 'Categoría', 'Precio', 'Stock', 'Estado', 'Acciones'].map((h) => (
                      <th key={h} className="px-6 py-3.5 text-[13px] font-extrabold text-white/80 uppercase tracking-[0.12em] leading-none whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6d5cc]">
                  {[...Array(itemsPerPage)].map((_, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FBE9DF]/60'}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 animate-pulse">
                          <div className="w-9 h-9 rounded-lg bg-gray-200" />
                          <div className="space-y-1.5">
                            <div className="h-3 w-32 bg-gray-200 rounded" />
                            <div className="h-2 w-20 bg-gray-100 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-16 bg-gray-200 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-24 bg-gray-100 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-16 bg-gray-100 rounded-lg ml-auto animate-pulse" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#B02F00] border-b border-[#8a2500]">
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-white/80 uppercase tracking-[0.12em] leading-none whitespace-nowrap">
                      {renderSortableHeader('Producto', 'nombre')}
                    </th>
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-white/80 uppercase tracking-[0.12em] leading-none whitespace-nowrap">
                      {renderSortableHeader('Categoría', 'categoria')}
                    </th>
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-white/80 uppercase tracking-[0.12em] leading-none whitespace-nowrap">
                      {renderSortableHeader('Precio', 'precio')}
                    </th>
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-white/80 uppercase tracking-[0.12em] leading-none whitespace-nowrap">
                      {renderSortableHeader('Stock', 'stock', '(un.)')}
                    </th>
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-white/80 uppercase tracking-[0.12em] leading-none whitespace-nowrap">
                      {renderSortableHeader('Estado', 'estado')}
                    </th>
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-white/80 uppercase tracking-[0.12em] leading-none whitespace-nowrap text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6d5cc]">
                  {currentItems.length > 0 ? (
                    currentItems.map((prod, idx) => {
                      const meta = getStockMeta(prod.stock);
                      const stockPct = Math.min(100, Math.round((Number(prod.stock) / maxStock) * 100));
                      return (
                      <tr
                        key={prod.id}
                        onDoubleClick={(e) => {
                          if (e.target.closest('button')) return;
                          handleEditar(prod.id);
                        }}
                        title="Doble click para editar"
                        className={`transition-colors group cursor-pointer ${idx % 2 === 0 ? 'bg-white hover:bg-[#FFF5F0]' : 'bg-[#FBE9DF]/60 hover:bg-[#FBE9DF]'}`}
                      >
                        <td className={`px-6 py-3.5 whitespace-nowrap${cellTone('nombre')}`}>
                          <div className="flex items-center gap-3">
                            {prod.imagenes?.[0]?.imagen ? (
                              <img
                                src={getAsset(prod.imagenes[0].imagen)}
                                alt={prod.nombre}
                                className="w-9 h-9 rounded-lg object-cover border border-[#e6d5cc] bg-[#FFF1EA]"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-[#FFF1EA] border border-[#ffdbcc] text-[#B02F00] flex items-center justify-center text-xs font-extrabold shrink-0">
                                {getInitials(prod.nombre)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate max-w-[220px]">{prod.nombre}</p>
                              <p className="text-[11px] text-gray-400 font-medium tabular-nums">ID #{prod.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-3.5 whitespace-nowrap${cellTone('categoria')}`}>
                          {renderCategoryBadge(prod.categoria?.nombre)}
                        </td>
                        <td className={`px-6 py-3.5 whitespace-nowrap${cellTone('precio')}`}>
                          <span className="text-sm font-bold text-gray-900 tabular-nums">{formatMoney(prod.precio)}</span>
                        </td>
                        <td className={`px-6 py-3.5 whitespace-nowrap${cellTone('stock')}`}>
                          <div className="flex items-center gap-2">
                            <span
                              title={`${prod.stock} unidades`}
                              aria-label={`${prod.stock} unidades en stock`}
                              className="text-sm text-gray-700 font-semibold tabular-nums"
                            >
                              {prod.stock}
                            </span>
                            <div className="w-16 h-1.5 bg-gray-200/70 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${stockPct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className={`px-6 py-3.5 whitespace-nowrap${cellTone('estado')}`}>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] border rounded-[3px] ${meta.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-[1px] ${meta.dot}`} />
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-right">
                          <div className="flex justify-end items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditar(prod.id)}
                              title="Editar Producto"
                              className="cursor-pointer p-2 text-gray-400 hover:text-[#B02F00] hover:bg-[#FFF1EA] transition-colors rounded-lg"
                            >
                              <Pencil size={17} strokeWidth={2} />
                            </button>
                            <button 
                              onClick={() => pedirEliminar(prod)}
                              title="Eliminar Producto"
                              className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                            >
                              <Trash2 size={17} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-14 text-center">
                        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#FFF1EA] text-[#B02F00] flex items-center justify-center mb-3">
                          <PackageSearch size={24} strokeWidth={2} />
                        </div>
                        <p className="text-sm font-bold text-gray-900">Sin resultados</p>
                        <p className="text-xs text-gray-500 mt-1">Probá ajustando la búsqueda o los filtros.</p>
                        {hayFiltros && (
                          <button
                            onClick={limpiarFiltros}
                            className="cursor-pointer mt-4 px-4 py-2 text-xs font-bold text-[#B02F00] border border-[#ffdbcc] bg-[#FFF1EA] hover:bg-[#FFE9DE] rounded-lg transition-colors"
                          >
                            Limpiar filtros
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="px-6 py-2 border-t border-[#e6d5cc] bg-[#fcfdfe] flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B02F00]">Tabla · Productos</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400"><span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-500" />En stock</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400"><span className="w-1.5 h-1.5 rounded-[1px] bg-amber-500" />Bajo stock</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400"><span className="w-1.5 h-1.5 rounded-[1px] bg-red-500" />Agotado</span>
            <span className="ml-auto text-[11px] text-gray-400">Doble click edita · click en cabecera ordena</span>
          </div>

          <div className="p-4 border-t border-[#e6d5cc] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#fcfdfe]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  title="Filas por página"
                  className="cursor-pointer appearance-none pl-3 pr-8 py-1.5 border border-[#e6d5cc] rounded-md text-xs font-bold text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-colors"
                >
                  <option value={5}>5 / pág</option>
                  <option value={10}>10 / pág</option>
                  <option value={15}>15 / pág</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs font-medium text-gray-500 tabular-nums">
                Mostrando <span className="font-bold text-gray-900">
                  {totalItems === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}
                </span> de <span className="font-bold text-gray-900">{totalItems}</span>
              </p>
            </div>
            
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

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => !borrando && setModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={modal.titulo}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${modal.tipo === 'error' ? 'bg-red-50 text-red-600' : 'bg-[#FFF1EA] text-[#B02F00]'}`}>
                  {modal.tipo === 'error'
                    ? <XCircle size={22} strokeWidth={2} />
                    : <AlertTriangle size={22} strokeWidth={2} />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900">{modal.titulo}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{modal.mensaje}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 bg-[#fcfdfe] border-t border-[#e6d5cc]">
              {modal.tipo === 'confirmar' ? (
                <>
                  <button
                    type="button"
                    disabled={borrando}
                    onClick={() => setModal(null)}
                    className="cursor-pointer px-4 py-2 bg-white border border-[#e6d5cc] text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={borrando}
                    onClick={modal.onConfirmar}
                    className="cursor-pointer px-4 py-2 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00] focus-visible:ring-offset-2"
                  >
                    {borrando ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="cursor-pointer px-4 py-2 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00] focus-visible:ring-offset-2"
                >
                  Entendido
                </button>
              )}
            </div>
            <button
              type="button"
              disabled={borrando}
              onClick={() => setModal(null)}
              title="Cerrar (Escape)"
              aria-label="Cerrar diálogo"
              className="cursor-pointer absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00]"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductManagement;
