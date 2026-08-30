import { useAssets } from '../context/AssetsContext';

const Hero = () => {
  const { getAsset, loading } = useAssets();
  const heroImgUrl = getAsset('MJMI/Home/Hero.webp');

  return (
    <section className="w-full bg-white font-space relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <div className="flex flex-col justify-center z-10">
            <p className="text-[#B02F00] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Tecnología & Precisión
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Explorá la Nueva Era del <br className="hidden lg:block" /> Diseño 3D.
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-lg">
              Piezas únicas, herramientas industriales y coleccionables diseñados con la máxima precisión técnica y un toque artístico inigualable.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="cursor-pointer px-8 py-3.5 bg-[#B02F00] hover:bg-[#8a2500] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              >
                Ver Catálogo
              </button>

              <button
                type="button"
                className="cursor-pointer px-8 py-3.5 bg-transparent border-2 border-[#907067] hover:border-[#B02F00] text-[#B02F00] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Sobre Nosotros
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-lg mx-auto lg:max-w-none lg:ml-auto mt-8 lg:mt-0">
            <div className="aspect-4/5 sm:aspect-square lg:aspect-4/5 w-full rounded-4xl overflow-hidden bg-[#1a1c1e] shadow-2xl relative">
              
              {/* Skeleton placeholder mientras se obtienen las URLs */}
              {loading ? (
                <div className="w-full h-full bg-gray-800 animate-pulse" />
              ) : (
                <img
                  src={heroImgUrl || null} 
                  alt="Impresora 3D en funcionamiento"
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-linear-to-tr from-black/20 to-transparent pointer-events-none"></div>
            </div>

            <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 lg:-left-12 bg-[#B02F00] text-white p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col justify-center border-4 border-white transform transition-transform hover:scale-105 cursor-default">
              <span className="text-3xl sm:text-4xl font-black leading-none mb-1">
                +500
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-90">
                Modelos Únicos
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;