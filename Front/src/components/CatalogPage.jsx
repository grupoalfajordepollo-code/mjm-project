import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Search, X, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { obtenerProductos, obtenerCategorias } from '../services/productoService';
import { formatPrecio } from '../utils/productoUi';
import ProductCard from './ProductCard';

const PAGE_SIZE = 9;

// Clasificación de disponibilidad (misma que el resto del sitio)
const estadoDe = (stock) => {
  const s = Number(stock) || 0;
  if (s === 0) return 'agotados';
  if (s <= 10) return 'ultimas';
  return 'disponibles';
};

const ESTADOS = [
  { id: 'disponibles', label: 'Disponible' },
  { id: 'ultimas', label: 'Últimas unidades' },
  { id: 'agotados', label: 'Agotado' },
];

const CatalogPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState(['Todas']);
  const [loading, setLoading] = useState(true);
  const [filtrosMovilAbiertos, setFiltrosMovilAbiertos] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const topeGridRef = useRef(null);

  // Filtros viven en la URL: links compartibles y atrás/adelante del navegador
  const q = searchParams.get('q') ?? '';
  const cat = searchParams.get('cat') ?? 'Todas';
  const dispParam = searchParams.get('disp') ?? 'disponibles,ultimas';
  const estadosActivos = useMemo(
    () => new Set(dispParam.split(',').filter(Boolean)),
    [dispParam]
  );
  const maxParam = searchParams.get('max');
  const orden = searchParams.get('orden') ?? 'destacados';
  const pagina = Math.max(1, Number(searchParams.get('page')) || 1);

  const patchParams = (patch) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) {
          next.delete(k);
        } else {
          next.set(k, Array.isArray(v) ? v.join(',') : String(v));
        }
      });
      return next;
    });
  };

  // Resetear a página 1 cada vez que cambia un filtro
  const setFiltro = (patch) => patchParams({ ...patch, page: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          obtenerProductos(),
          obtenerCategorias(),
        ]);
        setProductos(resProd.data ?? []);
        setCategorias(['Todas', ...(resCat.data ?? []).map((c) => c.nombre)]);
      } catch (err) {
        console.error('Error al cargar catálogo:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Techo del slider de precio: se calcula del catálogo real
  const techoPrecio = useMemo(() => {
    const max = productos.reduce((m, p) => Math.max(m, Number(p.precio) || 0), 0);
    if (!max) return 1000;
    const paso = max > 2000 ? 500 : 100;
    return Math.ceil(max / paso) * paso;
  }, [productos]);
  const maxPrecio = maxParam === null ? techoPrecio : Number(maxParam);
  const hayFiltroPrecio = maxParam !== null && Number(maxParam) < techoPrecio;

  const conteoEstados = useMemo(() => {
    const c = { disponibles: 0, ultimas: 0, agotados: 0 };
    productos.forEach((p) => { c[estadoDe(p.stock)] += 1; });
    return c;
  }, [productos]);

  const filtrados = useMemo(() => {
    const query = q.trim().toLowerCase();
    return productos.filter((p) => {
      if (cat !== 'Todas' && p.categoria?.nombre !== cat) return false;
      if (!estadosActivos.has(estadoDe(p.stock))) return false;
      if ((Number(p.precio) || 0) > maxPrecio) return false;
      if (query !== '' &&
        !((p.nombre || '').toLowerCase().includes(query) ||
          (p.descripcion || '').toLowerCase().includes(query))) return false;
      return true;
    });
  }, [productos, q, cat, estadosActivos, maxPrecio]);

  const ordenados = useMemo(() => {
    const arr = [...filtrados];
    if (orden === 'precio-asc') arr.sort((a, b) => Number(a.precio) - Number(b.precio));
    else if (orden === 'precio-desc') arr.sort((a, b) => Number(b.precio) - Number(a.precio));
    else if (orden === 'nombre') arr.sort((a, b) => String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es'));
    else if (orden === 'novedades') arr.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return arr;
  }, [filtrados, orden]);

  const totalPaginas = Math.max(1, Math.ceil(ordenados.length / PAGE_SIZE));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const visibles = ordenados.slice((paginaSegura - 1) * PAGE_SIZE, paginaSegura * PAGE_SIZE);

  const irAPagina = (n) => {
    patchParams({ page: n <= 1 ? null : n });
    topeGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleEstado = (id) => {
    const next = new Set(estadosActivos);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFiltro({ disp: [...next] });
  };

  const hayFiltros = cat !== 'Todas' || q !== '' || hayFiltroPrecio ||
    orden !== 'destacados' || dispParam !== 'disponibles,ultimas';

  const limpiarFiltros = () => {
    setSearchParams({});
  };

  const titulo = cat === 'Todas' ? 'Catálogo completo' : cat;

  if (loading) {
    return (
      <main className="w-full bg-[#fcfdfe] font-space py-16 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">Cargando catálogo...</p>
        </div>
      </main>
    );
  }

  const bloqueFiltros = (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4">Categorías</h3>
        <ul className="space-y-2.5">
          {categorias.map((c) => (
            <li key={c}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="categoria"
                  checked={cat === c}
                  onChange={() => setFiltro({ cat: c === 'Todas' ? null : c })}
                  className="h-4 w-4 accent-[#B02F00] cursor-pointer"
                />
                <span className={`text-sm transition-colors group-hover:text-[#B02F00] ${cat === c ? 'text-[#B02F00] font-bold' : 'text-gray-600'}`}>
                  {c === 'Todas' ? 'Todas' : c.charAt(0).toUpperCase() + c.slice(1)}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4">Disponibilidad</h3>
        <ul className="space-y-2.5">
          {ESTADOS.map((e) => (
            <li key={e.id}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={estadosActivos.has(e.id)}
                  onChange={() => toggleEstado(e.id)}
                  className="h-4 w-4 rounded accent-[#B02F00] cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#B02F00] transition-colors">
                  {e.label}
                </span>
                <span className="ml-auto text-xs text-gray-400 tabular-nums">
                  {conteoEstados[e.id]}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4">Precio máximo</h3>
        <input
          type="range"
          min={0}
          max={techoPrecio}
          step={Math.max(1, Math.round(techoPrecio / 100))}
          value={Math.min(maxPrecio, techoPrecio)}
          onChange={(e) => setFiltro({ max: Number(e.target.value) >= techoPrecio ? null : e.target.value })}
          className="w-full accent-[#B02F00] cursor-pointer"
          aria-label="Precio máximo"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2 tabular-nums">
          <span>$0</span>
          <span className="font-bold text-gray-900">Hasta ${formatPrecio(Math.min(maxPrecio, techoPrecio))}</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="w-full bg-[#fcfdfe] font-space py-8 md:py-12 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">

        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6">
            {bloqueFiltros}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Título + conteo + orden */}
          <div ref={topeGridRef} className="flex flex-wrap justify-between items-end gap-4 mb-6 scroll-mt-24">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{titulo}</h1>
              <p className="text-gray-500 text-sm mt-1">
                {ordenados.length} {ordenados.length === 1 ? 'producto encontrado' : 'productos encontrados'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Ordenar:</span>
              <div className="relative">
                <select
                  value={orden}
                  onChange={(e) => setFiltro({ orden: e.target.value === 'destacados' ? null : e.target.value })}
                  className="cursor-pointer appearance-none pl-4 pr-9 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00]"
                >
                  <option value="destacados">Destacados</option>
                  <option value="novedades">Novedades</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="nombre">Nombre A-Z</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Buscador local + chips móvil */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={q}
                onChange={(e) => setFiltro({ q: e.target.value || null })}
                className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00]"
              />
              {q && (
                <button
                  onClick={() => setFiltro({ q: null })}
                  title="Limpiar búsqueda"
                  className="cursor-pointer absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#B02F00]"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {categorias.map((c) => (
                <button
                  key={c}
                  onClick={() => setFiltro({ cat: c === 'Todas' ? null : c })}
                  className={`cursor-pointer whitespace-nowrap px-4 py-2 text-xs font-bold rounded-full transition-colors ${
                    cat === c ? 'bg-[#B02F00] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {c === 'Todas' ? 'Todas' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
              <button
                onClick={() => setFiltrosMovilAbiertos((v) => !v)}
                className={`cursor-pointer whitespace-nowrap px-4 py-2 text-xs font-bold rounded-full border transition-colors inline-flex items-center gap-1.5 ${
                  filtrosMovilAbiertos ? 'border-[#B02F00] text-[#B02F00]' : 'border-gray-200 text-gray-600'
                }`}
                aria-expanded={filtrosMovilAbiertos}
              >
                <SlidersHorizontal size={13} />
                Filtros
              </button>
            </div>

            {filtrosMovilAbiertos && (
              <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-6">
                {bloqueFiltros}
              </div>
            )}

            {hayFiltros && (
              <div>
                <button
                  onClick={limpiarFiltros}
                  className="cursor-pointer text-xs font-bold text-[#B02F00] hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {/* Grilla */}
          {visibles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-sm font-bold text-gray-900">Sin resultados</p>
              <p className="text-xs text-gray-500 mt-1">Probá ajustando la búsqueda o los filtros.</p>
              {hayFiltros && (
                <button
                  onClick={limpiarFiltros}
                  className="cursor-pointer mt-4 px-5 py-2 text-xs font-bold text-white bg-[#B02F00] hover:bg-[#8a2500] rounded-full transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {visibles.map((prod) => (
                <ProductCard key={prod.id} producto={prod} />
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="mt-10 flex justify-center items-center gap-2">
              <button
                onClick={() => irAPagina(paginaSegura - 1)}
                disabled={paginaSegura <= 1}
                aria-label="Página anterior"
                className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-[#B02F00] hover:border-[#B02F00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => irAPagina(n)}
                  aria-current={n === paginaSegura ? 'page' : undefined}
                  className={`cursor-pointer w-10 h-10 rounded-lg text-xs font-bold transition-colors ${
                    n === paginaSegura
                      ? 'bg-[#B02F00] text-white'
                      : 'border border-gray-200 text-gray-600 hover:border-[#B02F00] hover:text-[#B02F00]'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => irAPagina(paginaSegura + 1)}
                disabled={paginaSegura >= totalPaginas}
                aria-label="Página siguiente"
                className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-[#B02F00] hover:border-[#B02F00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CatalogPage;
