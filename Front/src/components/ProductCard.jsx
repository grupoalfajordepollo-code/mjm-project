import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAsset } from '../utils/getAssetsUrl';
import { getBadge, formatPrecio } from '../utils/productoUi';

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

// Card de producto reutilizable (home + página de catálogo).
// Sin acción de carrito: el footer lleva al detalle (carrito pendiente).
const ProductCard = ({ producto: prod }) => {
  const badge = getBadge(prod.stock);
  const agotado = Number(prod.stock) === 0;

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

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          {!agotado && (
            <span className="text-xl font-bold text-gray-900">
              ${formatPrecio(prod.precio)}
            </span>
          )}
          {agotado ? (
            <span className="text-xs font-bold text-gray-400 ml-auto">Agotado</span>
          ) : (
            <Link
              to={`/producto/${prod.id}`}
              className="ml-auto px-4 py-2 text-xs font-bold text-[#B02F00] bg-[#fff5f2] hover:bg-[#ffece6] rounded-lg transition-colors"
            >
              Ver producto
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
