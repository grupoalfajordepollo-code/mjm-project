import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { getAsset } from '../utils/getAssetsUrl';
import { getBadge, formatPrecio } from '../utils/productoUi';
import { useCart } from '../context/CartContext';

// Carrusel al hover: avanza las fotos del producto, con gracia breve para
// ignorar pasadas accidentales y puntitos de posición.
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

const ProductCard = ({ producto: prod }) => {
  const { agregarAlCarrito } = useCart();
  const [agregado, setAgregado] = useState(false);
  const badge = getBadge(prod.stock);
  const agotado = Number(prod.stock) === 0;

  const handleAgregar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (agotado) return;
    agregarAlCarrito(prod, 1);
    setAgregado(true);
    setTimeout(() => {
      setAgregado(false);
    }, 1500);
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
      <Link to={`/producto/${prod.id}`} className="relative aspect-4/3 bg-gray-100 overflow-hidden block group">
        <ProductCardImage prod={prod} badge={badge} />
      </Link>

      <div className="p-5 flex flex-col grow">
        <span className="text-[#B02F00] text-[10px] font-bold uppercase tracking-widest mb-1.5">
          {prod.categoria?.nombre}
        </span>

        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
          <Link to={`/producto/${prod.id}`} className="hover:text-[#B02F00] transition-colors">
            {prod.nombre}
          </Link>
        </h3>

        <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2 grow">
          {prod.descripcion}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 gap-2">
          {!agotado && (
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ${formatPrecio(prod.precio)}
            </span>
          )}
          {agotado ? (
            <span className="text-xs font-bold text-gray-400 ml-auto">Agotado</span>
          ) : (
            <div className="flex items-center gap-1.5 ml-auto">
              <Link
                to={`/producto/${prod.id}`}
                className="px-2.5 py-1.5 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                title="Ver detalle del producto"
              >
                Ver
              </Link>
              <button
                type="button"
                onClick={handleAgregar}
                disabled={agotado}
                className={`px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  agregado
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-[#B02F00] hover:bg-[#8e2600]'
                }`}
                title="Agregar al carrito"
                aria-label={`Agregar ${prod.nombre} al carrito`}
              >
                {agregado ? (
                  <>
                    <Check size={14} strokeWidth={2.5} />
                    <span>Listo</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={14} strokeWidth={2} />
                    <span>Agregar</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
