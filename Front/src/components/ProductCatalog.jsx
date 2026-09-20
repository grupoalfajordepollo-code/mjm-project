import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Search, X, ChevronDown } from 'lucide-react';
import { getAsset } from '../utils/getAssetsUrl';
import { obtenerProductos, obtenerCategorias } from '../services/productoService';


const getBadge = (stock) => {
  if (stock === 0) return { text: 'Agotado', style: 'bg-white text-gray-600 shadow-sm' };
  if (stock <= 10) return { text: '¡Últimas unidades!', style: 'bg-[#fef0cd] text-[#9a6a00]' };
  return { text: 'Disponible', style: 'bg-[#d1f4e0] text-[#1e7b45]' };
};

const ProductCardImage = ({ prod, badge }) => {
  const fotos = prod.imagenes?.length > 0 ? prod.imagenes : [];
  const [activa, setActiva] = useState(0);
  const timer = useRef(null);

  const avanzar = () => {
    setActiva((prev) => (prev + 1) % fotos.length);
  };

  const iniciar = () => {
    if (fotos.length < 2 || timer.current) return;
    // Gracia breve (ignora pasadas accidentales) y primer avance enseguida;
    // recién después entra la cadencia normal
    timer.current = setTimeout(() => {
      avanzar();
      timer.current = setInterval(avanzar, 2200);
    }, 350);
  };

  const detener = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      clearInterval(timer.current);
      timer.current = null;
    }
    setActiva(0);
  };

  useEffect(() => () => {
    if (timer.current) {
      clearTimeout(timer.current);
      clearInterval(timer.current);
    }
  }, []);

  return (
    <div
      className="relative aspect-4/3 bg-gray-100 overflow-hidden"
      onMouseEnter={iniciar}
      onMouseLeave={detener}
    >
      <div className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full z-10 ${badge.style}`}>
        {badge.text}
      </div>

      {fotos.length > 0 ? (
        fotos.map((foto, i) => (
          <img
            key={foto.id ?? i}
            src={getAsset(foto.imagen)}
            alt={`${prod.nombre} - foto ${i + 1} de ${fotos.length}`}
            loading="eager"
            aria-hidden={i !== activa}
            className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none motion-reduce:transform-none ${i === activa ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'}`}
          />
        ))
      ) : (
        <img
          src={getAsset()}
          alt={prod.nombre}
          className="w-full h-full object-cover"
        />
      )}

      {fotos.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
          {fotos.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${i === activa ? 'w-4 bg-white' : 'w-1 bg-white/60'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductCatalog = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState(["Todas"]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todas");
  // La búsqueda vive en la URL (?q=): la escriben el Header y este toolbar,
  // el catálogo solo la lee. Así quedan sincronizados y el link es compartible.
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") ?? "";
  const setBusqueda = (v) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v) next.set("q", v);
      else next.delete("q");
      return next;
    });
  };
  const [disponibilidad, setDisponibilidad] = useState("todos");
  const [orden, setOrden] = useState("destacados");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          obtenerProductos(),
          obtenerCategorias(),
        ]);
        setProductos(resProd.data);
        setCategorias(["Todas", ...resCat.data.map((c) => c.nombre)]);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtros de cliente: sin cantidades ni estados internos.
  // Disponibilidad trabaja por rangos (nunca expone el stock exacto) y el
  // orden se limita a precio y nombre (ordenar por stock filtraría inventario).
  const productosFiltrados = productos.filter((p) => {
    const matchCat = activeCategory === "Todas" || p.categoria?.nombre === activeCategory;
    const q = searchTerm.trim().toLowerCase();
    const matchQ = q === "" ||
      (p.nombre || "").toLowerCase().includes(q) ||
      (p.descripcion || "").toLowerCase().includes(q);
    const s = Number(p.stock) || 0;
    const matchDisp = disponibilidad === "todos" ||
      (disponibilidad === "disponibles" && s > 0) ||
      (disponibilidad === "ultimas" && s >= 1 && s <= 10);
    return matchCat && matchQ && matchDisp;
  });

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (orden === "precio-asc") return Number(a.precio) - Number(b.precio);
    if (orden === "precio-desc") return Number(b.precio) - Number(a.precio);
    if (orden === "nombre") return String(a.nombre || "").localeCompare(String(b.nombre || ""), "es");
    return 0;
  });

  const hayFiltros = activeCategory !== "Todas" || searchTerm !== "" || disponibilidad !== "todos" || orden !== "destacados";

  const limpiarFiltros = () => {
    setActiveCategory("Todas");
    setBusqueda("");
    setDisponibilidad("todos");
    setOrden("destacados");
  };

  if (loading) {
    return (
      <section className="w-full bg-[#fcfdfe] font-space py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">Cargando productos...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="w-full bg-[#fcfdfe] font-space py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Nuestras Categorías
            </h2>
            <p className="text-gray-500 text-sm">
              Filtrá por el tipo de pieza que necesitás
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer px-5 py-2 text-xs font-bold rounded-full transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#B02F00] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === "Todas" ? "Todas" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all"
            />
                {searchTerm && (
                  <button
                    onClick={() => setBusqueda("")}
                title="Limpiar búsqueda"
                className="cursor-pointer absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#B02F00] transition-colors"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={disponibilidad}
                onChange={(e) => setDisponibilidad(e.target.value)}
                title="Filtrar por disponibilidad"
                className="cursor-pointer appearance-none pl-4 pr-9 py-2.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all"
              >
                <option value="todos">Todos</option>
                <option value="disponibles">Disponibles</option>
                <option value="ultimas">Últimas unidades</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                title="Ordenar productos"
                className="cursor-pointer appearance-none pl-4 pr-9 py-2.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all"
              >
                <option value="destacados">Destacados</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <span className="px-3 py-2.5 text-xs font-bold text-gray-500 tabular-nums whitespace-nowrap">
              {productosOrdenados.length} {productosOrdenados.length === 1 ? "producto" : "productos"}
            </span>
            {hayFiltros && (
              <button
                onClick={limpiarFiltros}
                className="cursor-pointer px-4 py-2.5 text-xs font-bold text-[#B02F00] hover:bg-[#fff5f2] rounded-full transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {productosOrdenados.length === 0 ? (
            <div className="col-span-full text-center py-12">
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
            productosOrdenados.map((prod) => {
              const badge = getBadge(prod.stock);
              return (
                <article
                  key={prod.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
                >

                  <ProductCardImage prod={prod} badge={badge} />

                  <div className="p-5 flex flex-col grow">

                    <span className="text-[#B02F00] text-[10px] font-bold uppercase tracking-widest mb-1.5">
                      {prod.categoria?.nombre}
                    </span>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                      {prod.nombre}
                    </h3>

                    <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2 grow">
                      {prod.descripcion}
                    </p>

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                        {prod.stock > 0 && (
                          <span className="text-xl font-bold text-gray-900">
                            ${Number(prod.precio).toLocaleString('es-AR')}
                          </span>
                        )}

                      <button
                        disabled={prod.stock === 0}
                        className={`p-2 rounded-lg transition-colors ${
                          prod.stock === 0
                            ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "bg-[#fff5f2] text-[#B02F00] hover:bg-[#ffece6]"
                        }`}
                        aria-label="Agregar al carrito"
                      >
                        <ShoppingCart size={20} strokeWidth={2} />
                      </button>
                    </div>

                  </div>
                </article>
              );
            })
          )}

        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
