import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  Minus, 
  Plus, 
  ArrowLeft, 
  AlertTriangle,
  Check,
  Package
} from 'lucide-react';
import { obtenerProducto } from '../services/productoService';
import { getAsset } from '../utils/getAssetsUrl';

const getBadge = (stock) => {
  if (stock === 0) {
    return { 
      text: 'Agotado', 
      style: 'bg-gray-100 text-gray-600', 
      icon: null 
    };
  }
  if (stock <= 10) {
    return { 
      text: '¡Últimas unidades!', 
      style: 'bg-[#fef0cd] text-[#9a6a00]', 
      icon: <AlertTriangle size={12} className="inline mr-1 stroke-[2.5]" /> 
    };
  }
  return { 
    text: 'Disponible', 
    style: 'bg-[#d1f4e0] text-[#1e7b45]', 
    icon: null 
  };
};

const ProductDetail = ({ productoProp }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(productoProp || null);
  const [loading, setLoading] = useState(!productoProp && !!id);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [agregadoFeedback, setAgregadoFeedback] = useState(false);

  // Carga de producto desde el backend mediante el servicio productoService
  // NOTA: el reset de UI local (imagen activa, cantidad) ante un cambio de
  // producto lo hace el remount vía key={id} en App.jsx, no acá.
  useEffect(() => {
    window.scrollTo(0, 0);

    if (productoProp) {
      setProducto(productoProp);
      return;
    }

    if (!id) {
      // Si se accede sin ID (por ejemplo en /producto), dejamos estado preparado
      setLoading(false);
      return;
    }

    const fetchProducto = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await obtenerProducto(id);
        setProducto(res.data);
      } catch (err) {
        console.error('Error al cargar detalle del producto:', err);
        setError('No se pudo encontrar el producto solicitado o ocurrió un error en el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id, productoProp]);

  // Si no se encuentra el producto ni se pasó por prop y terminó la carga
  if (loading) {
    return (
      <section className="w-full min-h-[65vh] bg-[#fcfdfe] font-space flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#B02F00] rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm font-medium">Cargando detalles del producto...</p>
        </div>
      </section>
    );
  }

  if (error || (!producto && id)) {
    return (
      <section className="w-full min-h-[65vh] bg-[#fcfdfe] font-space flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Producto no disponible</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {error || 'El producto solicitado no existe o fue retirado del catálogo.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#B02F00] text-white text-sm font-bold rounded-xl hover:bg-[#8e2600] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Volver al catálogo
          </button>
        </div>
      </section>
    );
  }

  // Datos normalizados del producto (o valores de demostración si se visualiza el componente de forma aislada)
  const currentProd = producto || {
    id: 1,
    nombre: 'Prototipo Cinético "Aero" v2.1',
    precio: 450,
    stock: 4,
    categoria: { nombre: 'Impresión 3D' },
    descripcion: 'Experimenta la vanguardia de la manufactura aditiva con nuestro prototipo cinético Aero v2.1. Impreso en resina técnica de alta resistencia con un acabado superficial de grado industrial. Su estructura biónica optimizada permite una reducción de peso del 40% manteniendo la integridad estructural requerida para aplicaciones aerodinámicas de alta precisión.',
    sku: 'MJM-2024-X1'
  };

  // Normalización de la lista de imágenes recibidas desde la base de datos (OCI Object Storage)
  // Soporta tanto una imagen única (prod.imagen) como un array de imágenes secundarias (prod.imagenes)
  const resolveImagePath = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return item;
    return item.imagen || null;
  };

  const imagesList = [];
  if (Array.isArray(currentProd.imagenes) && currentProd.imagenes.length > 0) {
    currentProd.imagenes.forEach((img) => {
      const path = resolveImagePath(img);
      if (path) imagesList.push(path);
    });
  } else if (currentProd.imagen) {
    const path = resolveImagePath(currentProd.imagen);
    if (path) imagesList.push(path);
  }

  // Si no hay imágenes configuradas aún en el objeto OCI, se utiliza el fallback oficial
  const safeImageIndex = imagesList.length > 0 ? Math.min(activeImageIndex, imagesList.length - 1) : 0;
  const activeImagePath = imagesList[safeImageIndex] || null;
  const activeImageUrl = getAsset(activeImagePath);

  const stockDisponible = typeof currentProd.stock === 'number' ? currentProd.stock : 1;
  const isAgotado = stockDisponible === 0;
  const badgeInfo = getBadge(stockDisponible);

  // Manejadores de cantidad
  const handleDecrementar = () => {
    setCantidad((prev) => Math.max(1, prev - 1));
  };

  const handleIncrementar = () => {
    setCantidad((prev) => {
      if (stockDisponible > 0 && prev >= stockDisponible) return prev;
      return prev + 1;
    });
  };

  // Agregar al carrito
  const handleAgregarAlCarrito = () => {
    if (isAgotado) return;
    setAgregadoFeedback(true);
    setTimeout(() => {
      setAgregadoFeedback(false);
    }, 2500);
  };

  const formattedPrice = Number(currentProd.precio || 0).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const skuCode = currentProd.sku || `Ref: MJM-${String(currentProd.id || 1).padStart(4, '0')}`;

  return (
    <main className="w-full bg-[#fcfdfe] font-space py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#B02F00] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Volver al catálogo</span>
          </Link>

          {currentProd.categoria?.nombre && (
            <span className="text-xs font-bold uppercase tracking-widest text-[#B02F00]">
              {currentProd.categoria.nombre}
            </span>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_-15px_rgba(0,0,0,0.06)] p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            <div className="flex flex-col gap-4">
              
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#0e1015] flex items-center justify-center shadow-inner border border-gray-100">
                <img
                  src={activeImageUrl}
                  alt={currentProd.nombre}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>

              {imagesList.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {imagesList.map((imgItem, idx) => {
                    const thumbUrl = getAsset(imgItem);
                    const isActive = safeImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`cursor-pointer relative aspect-square rounded-xl overflow-hidden bg-[#0e1015] transition-all ${
                          isActive
                            ? 'ring-2 ring-[#ea580c] ring-offset-2 scale-[1.02]'
                            : 'opacity-70 hover:opacity-100 border border-gray-200'
                        }`}
                        aria-label={`Ver imagen ${idx + 1}`}
                      >
                        <img
                          src={thumbUrl}
                          alt={`${currentProd.nombre} miniatura ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              
              <div className="flex items-center justify-between gap-4 mb-2">
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${badgeInfo.style}`}
                >
                  {badgeInfo.icon}
                  {badgeInfo.text}
                </span>

                <span className="text-xs font-semibold text-gray-400 tracking-wider">
                  {skuCode.startsWith('Ref:') ? skuCode : `Ref: ${skuCode}`}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mt-2 mb-3">
                {currentProd.nombre}
              </h1>

              <div className="mb-5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#c2410c] tracking-tight">
                  ${formattedPrice}
                </span>
              </div>

              <hr className="border-t border-gray-100 my-2 mb-5" />

              <div className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2.5">
                  DESCRIPCIÓN
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {currentProd.descripcion || 'Sin descripción detallada disponible.'}
                </p>
              </div>

              <hr className="border-t border-gray-100 my-2 mb-6" />

              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-sm font-semibold text-gray-800">
                  Cantidad
                </span>

                <div className="inline-flex items-center bg-[#f0f3f6] rounded-xl p-1 border border-gray-200/60">
                  <button
                    type="button"
                    onClick={handleDecrementar}
                    disabled={cantidad <= 1 || isAgotado}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors rounded-lg hover:bg-white"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus size={15} strokeWidth={2.5} />
                  </button>

                  <span className="w-10 text-center text-sm font-bold text-gray-900 select-none">
                    {cantidad}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrementar}
                    disabled={isAgotado || (stockDisponible > 0 && cantidad >= stockDisponible)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors rounded-lg hover:bg-white"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAgregarAlCarrito}
                disabled={isAgotado}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-base shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer ${
                  isAgotado
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-[#ff5722] hover:bg-[#ea580c] active:scale-[0.99] shadow-orange-500/20'
                }`}
              >
                {agregadoFeedback ? (
                  <>
                    <Check size={20} strokeWidth={2.5} />
                    <span>¡Agregado al Carrito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} strokeWidth={2.2} />
                    <span>{isAgotado ? 'Producto Agotado' : 'Agregar al Carrito'}</span>
                  </>
                )}
              </button>

              {stockDisponible > 0 && stockDisponible <= 5 && (
                <p className="text-center text-xs text-amber-600 mt-2 font-medium">
                  ¡Solo quedan {stockDisponible} en inventario!
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
                
                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border border-gray-200/80 bg-white">
                  <div className="p-2 rounded-lg bg-orange-50 text-[#ea580c] shrink-0">
                    <Truck size={20} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      Envío Express
                    </span>
                    <span className="text-[11px] sm:text-xs text-gray-500 truncate">
                      24-48 horas
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border border-gray-200/80 bg-white">
                  <div className="p-2 rounded-lg bg-orange-50 text-[#ea580c] shrink-0">
                    <ShieldCheck size={20} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      Garantía MJM
                    </span>
                    <span className="text-[11px] sm:text-xs text-gray-500 truncate">
                      Calidad asegurada
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </main>
  );
};

export default ProductDetail;
