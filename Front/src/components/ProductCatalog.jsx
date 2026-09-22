import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown } from 'lucide-react';
import { obtenerProductos, obtenerCategorias } from '../services/productoService';
import ProductCard from './ProductCard';


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
            productosOrdenados.map((prod) => (
              <ProductCard key={prod.id} producto={prod} />
            ))
          )}

        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
