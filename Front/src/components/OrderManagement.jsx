import { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  Package,
  Truck,
  BadgeCheck,
  Eye,
  X
} from 'lucide-react';
import { obtenerPedidos, actualizarPedido } from '../services/pedidoService';

const ESTADOS = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];

// Espejo del back (pedidoController.TRANSICIONES): Entregado y Cancelado son
// terminales; Enviado solo avanza a Entregado. El back lo impone (409), acá
// solo se deshabilita lo no permitido.
const TRANSICIONES = {
  Pendiente: ['Enviado', 'Cancelado'],
  Enviado: ['Entregado'],
  Entregado: [],
  Cancelado: [],
};

const getEstadoMeta = (estado) => {
  switch (estado) {
    case 'Pendiente':
      return { pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', dot: 'bg-amber-500' };
    case 'Enviado':
      return { pill: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200', dot: 'bg-sky-500' };
    case 'Entregado':
      return { pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' };
    case 'Cancelado':
      return { pill: 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-300', dot: 'bg-zinc-400' };
    default:
      return { pill: 'bg-gray-50 text-gray-600 ring-1 ring-gray-200', dot: 'bg-gray-400' };
  }
};

const getPagoMeta = (pago) => {
  if (!pago) return { label: 'Sin pago', pill: 'bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200', dot: 'bg-zinc-300' };
  if (pago.estadoPago === 'Aprobado') return { label: pago.estadoPago, pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' };
  if (pago.estadoPago === 'Rechazado') return { label: pago.estadoPago, pill: 'bg-red-50 text-red-700 ring-1 ring-red-200', dot: 'bg-red-500' };
  return { label: pago.estadoPago || 'Pendiente', pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', dot: 'bg-amber-500' };
};

const OrderManagement = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [sortField, setSortField] = useState('fecha');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [expandido, setExpandido] = useState(null);
  const [gestionando, setGestionando] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await obtenerPedidos();
      setPedidos(res.data);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const formatMoney = (value) =>
    `$${Number(value || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

  const formatFecha = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const nombreCliente = (p) =>
    `${p.usuario?.nombre || ''} ${p.usuario?.apellido || ''}`.trim() || '—';

  const totalUnidades = (p) =>
    (p.items || []).reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0);

  const pedidosFiltrados = pedidos.filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    const matchQ = q === '' ||
      String(p.id).includes(q) ||
      nombreCliente(p).toLowerCase().includes(q) ||
      (p.usuario?.email || '').toLowerCase().includes(q);
    const matchEstado = estadoFiltro === 'todos' || p.estado === estadoFiltro;
    return matchQ && matchEstado;
  });

  const hayFiltros = searchTerm !== '' || estadoFiltro !== 'todos';

  const limpiarFiltros = () => {
    setSearchTerm('');
    setEstadoFiltro('todos');
    setCurrentPage(1);
  };

  const rangoEstado = (estado) => ESTADOS.indexOf(estado);

  const pedidosOrdenados = [...pedidosFiltrados].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'fecha') {
      comparison = new Date(a.fechaPedido || a.createdAt) - new Date(b.fechaPedido || b.createdAt);
    } else if (sortField === 'total') {
      comparison = Number(a.total) - Number(b.total);
    } else if (sortField === 'estado') {
      comparison = rangoEstado(a.estado) - rangoEstado(b.estado);
    } else if (sortField === 'cliente') {
      comparison = nombreCliente(a).localeCompare(nombreCliente(b), 'es');
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const toggleSort = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection(field === 'fecha' ? 'desc' : 'asc');
    } else {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ChevronsUpDown size={14} strokeWidth={2.5} />;
    return sortDirection === 'asc'
      ? <ArrowUp size={14} strokeWidth={2.5} />
      : <ArrowDown size={14} strokeWidth={2.5} />;
  };

  const renderSortableHeader = (label, field) => {
    const isActive = sortField === field;
    return (
      <button
        onClick={() => toggleSort(field)}
        title={`Ordenar por ${label}`}
        className={`inline-flex items-center gap-2 leading-none py-1 px-1 -mx-1 rounded-[3px] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${isActive ? 'text-white hover:bg-white/10' : 'text-[#899fb5] hover:text-white hover:bg-white/10'}`}
      >
        <span className="leading-none">{label}</span>
        <span className={`inline-flex shrink-0 items-center justify-center p-1 rounded-md transition-colors ${isActive ? 'bg-[#B02F00] text-white' : 'bg-white/10 text-[#899fb5]'}`}>
          {getSortIcon(field)}
        </span>
      </button>
    );
  };

  const abrirGestion = (pedido) => {
    setGestionando(pedido);
    setNuevoEstado(pedido.estado);
    setModalError('');
  };

  const guardarEstado = async () => {
    if (!gestionando || nuevoEstado === gestionando.estado) {
      setGestionando(null);
      return;
    }
    setGuardando(true);
    setModalError('');
    const permitidas = TRANSICIONES[gestionando.estado] || [];
    if (nuevoEstado !== gestionando.estado && !permitidas.includes(nuevoEstado)) {
      setModalError('Transición no permitida para este pedido.');
      setGuardando(false);
      return;
    }
    try {
      await actualizarPedido(gestionando.id, { estado: nuevoEstado });
      setPedidos((prev) => prev.map((p) =>
        p.id === gestionando.id ? { ...p, estado: nuevoEstado } : p
      ));
      setGestionando(null);
    } catch (err) {
      console.error('Error al actualizar pedido:', err);
      setModalError('No se pudo guardar el cambio. Intentá de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const conteo = (estado) => pedidos.filter((p) => p.estado === estado).length;

  const totalItems = pedidosOrdenados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pedidosOrdenados.slice(indexOfFirstItem, indexOfLastItem);

  const kpis = [
    { label: 'Pendientes', valor: conteo('Pendiente'), icon: Package, box: 'bg-amber-50 text-amber-600', filtro: 'Pendiente' },
    { label: 'Enviados', valor: conteo('Enviado'), icon: Truck, box: 'bg-sky-50 text-sky-600', filtro: 'Enviado' },
    { label: 'Entregados', valor: conteo('Entregado'), icon: BadgeCheck, box: 'bg-emerald-50 text-emerald-600', filtro: 'Entregado' },
  ];

  return (
    <main className="flex-1 bg-[#fcfdfe] font-space p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Pedidos</h1>
            <p className="text-sm text-gray-500 mt-1">Seguimiento y estados de las ventas.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const activo = estadoFiltro === kpi.filtro;
            return (
              <button
                key={kpi.label}
                onClick={() => { setEstadoFiltro((prev) => (prev === kpi.filtro ? 'todos' : kpi.filtro)); setCurrentPage(1); }}
                title={`Filtrar pedidos ${kpi.label.toLowerCase()}`}
                className={`cursor-pointer text-left bg-white border rounded-2xl p-4 flex items-center gap-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] transition-colors ${activo ? 'border-[#B02F00] ring-2 ring-[#B02F00]/20' : 'border-[#e6d5cc] hover:border-[#B02F00]/40'}`}
              >
                <div className={`p-2.5 rounded-xl ${kpi.box}`}>
                  <Icon size={20} strokeWidth={2.25} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">{kpi.label}</p>
                  <p className="text-xl font-extrabold text-gray-900 tabular-nums leading-tight">{kpi.valor}</p>
                </div>
              </button>
            );
          })}
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
                  placeholder="Buscar por n°, cliente o email..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2 border border-[#e6d5cc] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-colors"
                />
              </div>
              <div className="relative">
                <select
                  value={estadoFiltro}
                  onChange={(e) => { setEstadoFiltro(e.target.value); setCurrentPage(1); }}
                  className="cursor-pointer appearance-none w-full sm:w-auto pl-3 pr-9 py-2 border border-[#e6d5cc] rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-colors"
                >
                  <option value="todos">Todos los estados</option>
                  {ESTADOS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
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
              <span className="px-2.5 py-1.5 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg tabular-nums whitespace-nowrap">
                {totalItems} {totalItems === 1 ? 'pedido' : 'pedidos'}
              </span>
              <button
                onClick={fetchPedidos}
                title="Actualizar datos"
                className="cursor-pointer p-2 text-gray-500 hover:text-[#B02F00] hover:bg-[#fff5f2] rounded-lg transition-colors border border-transparent hover:border-[#ffdbcc]"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="px-6 py-12 text-center text-sm text-gray-500">Cargando pedidos...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#24272c] border-b border-[#31353b]">
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-[#899fb5] uppercase tracking-[0.12em] leading-none whitespace-nowrap">
                      {renderSortableHeader('Pedido', 'fecha')}
                    </th>
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-[#899fb5] uppercase tracking-[0.12em] leading-none whitespace-nowrap">
                      {renderSortableHeader('Cliente', 'cliente')}
                    </th>
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-[#899fb5] uppercase tracking-[0.12em] leading-none whitespace-nowrap">
                      Items
                    </th>
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-[#899fb5] uppercase tracking-[0.12em] leading-none whitespace-nowrap">
                      {renderSortableHeader('Total', 'total')}
                    </th>
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-[#899fb5] uppercase tracking-[0.12em] leading-none whitespace-nowrap">
                      Pago
                    </th>
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-[#899fb5] uppercase tracking-[0.12em] leading-none whitespace-nowrap">
                      {renderSortableHeader('Estado', 'estado')}
                    </th>
                    <th className="px-6 py-3.5 text-[13px] font-extrabold text-[#899fb5] uppercase tracking-[0.12em] leading-none whitespace-nowrap text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6d5cc]">
                  {currentItems.length > 0 ? (
                    currentItems.flatMap((pedido, idx) => {
                      const meta = getEstadoMeta(pedido.estado);
                      const pago = getPagoMeta(pedido.pago);
                      const filas = [(
                        <tr
                          key={pedido.id}
                          onDoubleClick={(e) => {
                            if (e.target.closest('button')) return;
                            abrirGestion(pedido);
                          }}
                          title="Doble click para gestionar"
                          className={`transition-colors group cursor-pointer ${idx % 2 === 0 ? 'bg-white hover:bg-[#FFF5F0]' : 'bg-[#FBE9DF]/60 hover:bg-[#FBE9DF]'}`}
                        >
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <p className="text-sm font-bold text-gray-900 tabular-nums">#{pedido.id}</p>
                            <p className="text-[11px] text-gray-400 font-medium tabular-nums">{formatFecha(pedido.fechaPedido)}</p>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{nombreCliente(pedido)}</p>
                            <p className="text-[11px] text-gray-400 font-medium truncate max-w-[200px]">{pedido.usuario?.email || '—'}</p>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <span
                              title={`${totalUnidades(pedido)} artículos`}
                              className="text-sm text-gray-700 font-semibold tabular-nums"
                            >
                              {totalUnidades(pedido)}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <span className="text-sm font-bold text-gray-900 tabular-nums">{formatMoney(pedido.total)}</span>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] border rounded-[3px] ${pago.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-[1px] ${pago.dot}`} />
                              {pago.label}
                            </span>
                            {pedido.pago?.metodoPago && (
                              <p className="text-[11px] text-gray-400 font-medium truncate max-w-[140px] mt-0.5">{pedido.pago.metodoPago}</p>
                            )}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] border rounded-[3px] ${meta.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-[1px] ${meta.dot}`} />
                              {pedido.estado}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap text-right">
                            <div className="flex justify-end items-center gap-1">
                              <button
                                onClick={() => setExpandido((prev) => (prev === pedido.id ? null : pedido.id))}
                                title={expandido === pedido.id ? 'Ocultar detalle' : 'Ver detalle'}
                                className="cursor-pointer p-2 text-gray-400 hover:text-[#B02F00] hover:bg-[#FFF1EA] transition-colors rounded-lg"
                              >
                                <ChevronDown size={17} strokeWidth={2} className={`transition-transform ${expandido === pedido.id ? 'rotate-180' : ''}`} />
                              </button>
                              <button
                                onClick={() => abrirGestion(pedido)}
                                title="Gestionar pedido"
                                className="cursor-pointer p-2 text-gray-400 hover:text-[#B02F00] hover:bg-[#FFF1EA] transition-colors rounded-lg"
                              >
                                <Eye size={17} strokeWidth={2} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )];
                      if (expandido === pedido.id) {
                        filas.push(
                          <tr key={`${pedido.id}-detalle`} className="bg-[#fcfdfe]">
                            <td colSpan="7" className="px-6 py-4">
                              <div className="border border-[#e6d5cc] rounded-lg overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="bg-[#f6efe9]">
                                      <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Producto</th>
                                      <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Cant.</th>
                                      <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">P. unit.</th>
                                      <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#e6d5cc] bg-white">
                                    {(pedido.items || []).map((it) => (
                                      <tr key={it.id}>
                                        <td className="px-4 py-2 text-sm font-medium text-gray-800">{it.producto?.nombre || `#${it.idProducto}`}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600 tabular-nums text-right">{it.cantidad}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600 tabular-nums text-right">{formatMoney(it.precioUnitario)}</td>
                                        <td className="px-4 py-2 text-sm font-bold text-gray-900 tabular-nums text-right">{formatMoney(it.subtotal)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return filas;
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-14 text-center">
                        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#FFF1EA] text-[#B02F00] flex items-center justify-center mb-3">
                          <Package size={24} strokeWidth={2} />
                        </div>
                        <p className="text-sm font-bold text-gray-900">Sin pedidos</p>
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
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#24272c]">Tabla · Pedidos</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400"><span className="w-1.5 h-1.5 rounded-[1px] bg-amber-500" />Pendiente</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400"><span className="w-1.5 h-1.5 rounded-[1px] bg-sky-500" />Enviado</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400"><span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-500" />Entregado</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400"><span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-400" />Cancelado</span>
            <span className="ml-auto text-[11px] text-gray-400">Enviados, entregados y cancelados: solo lectura</span>
          </div>

          <div className="p-4 border-t border-[#e6d5cc] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#fcfdfe]">
            <p className="text-xs font-medium text-gray-500 tabular-nums">
              Mostrando <span className="font-bold text-gray-900">
                {totalItems === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}
              </span> de <span className="font-bold text-gray-900">{totalItems}</span>
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="cursor-pointer p-1.5 border border-[#e6d5cc] rounded-md text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`cursor-pointer px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer p-1.5 border border-[#e6d5cc] rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {gestionando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => !guardando && setGestionando(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Gestionar pedido #${gestionando.id}`}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 tabular-nums">Pedido #{gestionando.id}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {nombreCliente(gestionando)} · {gestionando.usuario?.email || '—'} · {formatFecha(gestionando.fechaPedido)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={guardando}
                  onClick={() => setGestionando(null)}
                  title="Cerrar (Escape)"
                  aria-label="Cerrar diálogo"
                  className="cursor-pointer p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              <div className="border border-[#e6d5cc] rounded-lg overflow-hidden mb-5">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-[#e6d5cc] bg-white">
                    {(gestionando.items || []).map((it) => (
                      <tr key={it.id}>
                        <td className="px-4 py-2.5 text-sm font-medium text-gray-800">
                          {it.producto?.nombre || `#${it.idProducto}`}
                          <span className="text-gray-400 font-normal"> × {it.cantidad}</span>
                        </td>
                        <td className="px-4 py-2.5 text-sm font-bold text-gray-900 tabular-nums text-right">{formatMoney(it.subtotal)}</td>
                      </tr>
                    ))}
                    <tr className="bg-[#fcfdfe]">
                      <td className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</td>
                      <td className="px-4 py-2.5 text-sm font-extrabold text-gray-900 tabular-nums text-right">{formatMoney(gestionando.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estado del pedido</p>
              {(TRANSICIONES[gestionando.estado] || []).length === 0 && (
                <p className="mb-3 px-3 py-2 text-xs font-bold text-zinc-600 bg-zinc-100 border border-zinc-200 rounded-lg">
                  Pedido {gestionando.estado.toLowerCase()}: cerrado, solo lectura.
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 mb-2">
                {ESTADOS.map((estado) => {
                  const meta = getEstadoMeta(estado);
                  const esActual = estado === gestionando.estado;
                  const permitido = esActual || (TRANSICIONES[gestionando.estado] || []).includes(estado);
                  const seleccionado = nuevoEstado === estado;
                  return (
                    <button
                      key={estado}
                      type="button"
                      disabled={guardando || !permitido}
                      onClick={() => setNuevoEstado(estado)}
                      title={permitido ? (esActual ? 'Estado actual' : `Cambiar a ${estado}`) : 'Transición no permitida'}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-extrabold uppercase tracking-[0.12em] border rounded-lg transition-all ${!permitido
                        ? 'border-[#e6d5cc] text-gray-300 bg-gray-50 cursor-not-allowed'
                        : seleccionado
                          ? `${meta.pill} ring-2 ring-[#B02F00]/40 cursor-pointer`
                          : 'border-[#e6d5cc] text-gray-500 hover:border-gray-400 bg-white cursor-pointer'
                        } disabled:cursor-not-allowed`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-[1px] ${permitido ? meta.dot : 'bg-gray-300'}`} />
                      {estado}
                    </button>
                  );
                })}
              </div>
              {modalError && (
                <p className="text-xs font-bold text-red-600 mt-1">{modalError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 bg-[#fcfdfe] border-t border-[#e6d5cc]">
              {(TRANSICIONES[gestionando.estado] || []).length === 0 ? (
                <button
                  type="button"
                  onClick={() => setGestionando(null)}
                  className="cursor-pointer px-4 py-2 bg-[#24272c] hover:bg-[#31353b] text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={guardando}
                    onClick={() => setGestionando(null)}
                    className="cursor-pointer px-4 py-2 bg-white border border-[#e6d5cc] text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={guardando}
                    onClick={guardarEstado}
                    className="cursor-pointer px-4 py-2 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default OrderManagement;
