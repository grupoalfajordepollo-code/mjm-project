import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { getAsset } from '../utils/getAssetsUrl';
import { obtenerProductos } from '../services/productoService';

const categorias = ["Todas", "branding", "bazar", "juguetes", "hobbie"];

const getBadge = (stock) => {
  if (stock === 0) return { text: 'Agotado', style: 'bg-white text-gray-600 shadow-sm' };
  if (stock <= 10) return { text: '¡Últimas unidades!', style: 'bg-[#fef0cd] text-[#9a6a00]' };
  return { text: 'Disponible', style: 'bg-[#d1f4e0] text-[#1e7b45]' };
};

const ProductCatalog = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todas");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await obtenerProductos();
        setProductos(res.data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const productosFiltrados = activeCategory === "Todas"
    ? productos
    : productos.filter((p) => p.categoria?.nombre === activeCategory);

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
    <section className="w-full bg-[#fcfdfe] font-space py-16">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {productosFiltrados.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 text-sm py-8">
              No se encontraron productos en esta categoría.
            </p>
          ) : (
            productosFiltrados.map((prod) => {
              const badge = getBadge(prod.stock);
              return (
                <article
                  key={prod.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
                >

                  <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                    <div className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full z-10 ${badge.style}`}>
                      {badge.text}
                    </div>

                    <img
                      src={getAsset(prod.imagen?.imagen)}
                      alt={prod.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

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
                      <span className="text-xl font-bold text-gray-900">
                        ${Number(prod.precio).toLocaleString('es-AR')}
                      </span>

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
