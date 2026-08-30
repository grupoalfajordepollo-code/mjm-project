import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAssets } from '../context/AssetsContext';

// Guardamos las rutas relativas locales en string
const productos = [
  {
    id: 1,
    category: "Branding",
    title: "Organizador Apex",
    description: "Estructura modular diseñada para espacios de trabajo modernos que...",
    price: "$4.500",
    status: "Disponible",
    imagePath: "MJMI/Home/Product1.webp",
  },
  {
    id: 2,
    category: "Bazar",
    title: "Florero Voronoi",
    description: "Pieza decorativa basada en patrones matemáticos naturales...",
    price: "$3.200",
    status: "¡Últimas unidades!",
    imagePath: "MJMI/Home/Product2.webp",
  },
  {
    id: 3,
    category: "Juguetes",
    title: "Dragón Articulado",
    description: "Figura de acción con más de 40 puntos de articulación impresa en...",
    price: "$5.800",
    status: "Disponible",
    imagePath: "MJMI/Home/Product3.webp",
  },
  {
    id: 4,
    category: "Hobbie",
    title: "Gabinete MK-Z",
    description: "Carcasa premium para teclado mecánico, optimizada para...",
    price: "$12.000",
    status: "Agotado",
    imagePath: "MJMI/Home/Product4.webp",
  }
];

const categorias = ["Todas", "Branding", "Bazar", "Juguetes", "Hobbie"];

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState("Todas");
  const { getAsset, loading } = useAssets(); // Extraemos el helper y el estado de carga

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Disponible':
        return 'bg-[#d1f4e0] text-[#1e7b45]'; 
      case '¡Últimas unidades!':
        return 'bg-[#fef0cd] text-[#9a6a00]'; 
      case 'Agotado':
        return 'bg-white text-gray-600 shadow-sm';
      default:
        return 'bg-white text-gray-800';
    }
  };

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
                {cat}
              </button>
            ))}
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {productos.map((prod) => {
            const imgUrl = getAsset(prod.imagePath);

            return (
              <article 
                key={prod.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
              >
                
                <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                  <div className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full z-10 ${getBadgeStyle(prod.status)}`}>
                    {prod.status}
                  </div>
                  
                  {loading ? (
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                  ) : (
                    <img 
                      src={imgUrl || null} 
                      alt={prod.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="p-5 flex flex-col grow">
                  
                  <span className="text-[#B02F00] text-[10px] font-bold uppercase tracking-widest mb-1.5">
                    {prod.category}
                  </span>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                    {prod.title}
                  </h3>
                  
                  <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2 grow">
                    {prod.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                    <span className="text-xl font-bold text-gray-900">
                      {prod.price}
                    </span>
                    
                    <button 
                      disabled={prod.status === "Agotado"}
                      className={`p-2 rounded-lg transition-colors ${
                        prod.status === "Agotado"
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
          })}

        </div>
      </div>
    </section>
  );
};

export default Categories;