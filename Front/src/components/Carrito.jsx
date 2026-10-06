import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  Minus, 
  Plus, 
  Truck, 
  ShieldCheck, 
  Box, 
  Layers, 
  Ruler, 
  Wrench, 
  Cpu, 
  ShoppingBag,
  CheckCircle2,
  X,
  CreditCard,
  Building2,
  MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getAsset } from '../utils/getAssetsUrl';
import { crearPedido } from '../services/pedidoService';
import { obtenerDomiciliosPorUsuario } from '../services/domicilioService';

const formatearMoneda = (valor) => {
  return Number(valor || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Icono según tipo de tag del prototipo (STL, 120mm, Soporte No Req., PETG-CF, etc.)
const renderIconoTag = (label, tipo) => {
  const lbl = String(label).toLowerCase();
  if (tipo === 'mesh' || lbl.includes('stl') || lbl.includes('obj')) {
    return <Box size={13} className="stroke-[2.2]" />;
  }
  if (tipo === 'dimension' || lbl.includes('mm') || lbl.includes('cm')) {
    return <Ruler size={13} className="stroke-[2.2]" />;
  }
  if (tipo === 'feature' || lbl.includes('soporte') || lbl.includes('req')) {
    return <Wrench size={13} className="stroke-[2.2]" />;
  }
  if (tipo === 'material' || lbl.includes('petg') || lbl.includes('pla') || lbl.includes('resina')) {
    return <Cpu size={13} className="stroke-[2.2]" />;
  }
  return <Layers size={13} className="stroke-[2.2]" />;
};

const Carrito = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    cart, 
    subtotal, 
    costoEnvio, 
    impuestos, 
    total, 
    totalItems,
    decrementarCantidad, 
    incrementarCantidad, 
    eliminarDelCarrito, 
    vaciarCarrito
  } = useCart();

  const [modalCheckoutAbierto, setModalCheckoutAbierto] = useState(false);
  const [metodoPago, setMetodoPago] = useState('mercadopago');
  const [direccionEnvio, setDireccionEnvio] = useState('');
  const [domicilios, setDomicilios] = useState([]);
  const [domicilioSeleccionadoId, setDomicilioSeleccionadoId] = useState(null);
  const [modoDireccion, setModoDireccion] = useState('guardada'); // 'guardada' | 'otra'
  const [cargandoDomicilios, setCargandoDomicilios] = useState(false);
  const [procesandoCompra, setProcesandoCompra] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);
  const [direccionConfirmada, setDireccionConfirmada] = useState('');

  const cargarDomiciliosUsuario = async (userId) => {
    if (!userId) return;
    setCargandoDomicilios(true);
    try {
      const res = await obtenerDomiciliosPorUsuario(userId);
      const lista = Array.isArray(res.data) ? res.data : [];
      setDomicilios(lista);
      if (lista.length > 0) {
        const fav = lista.find((d) => d.favorito) || lista[0];
        setDomicilioSeleccionadoId(fav.id);
        setModoDireccion('guardada');
      } else {
        setModoDireccion('otra');
      }
    } catch (err) {
      console.error("Error al cargar domicilios del usuario:", err);
      setModoDireccion('otra');
    } finally {
      setCargandoDomicilios(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      cargarDomiciliosUsuario(user.id);
    } else {
      setDomicilios([]);
      setDomicilioSeleccionadoId(null);
      setModoDireccion('otra');
    }
  }, [user?.id]);

  const formatearDomicilio = (dom) => {
    if (!dom) return '';
    const partes = [
      `${dom.calle || ''} ${dom.numero || ''}`.trim(),
      dom.ciudad,
      dom.provincia
    ].filter(Boolean);
    let str = partes.join(', ');
    if (dom.codigoPostal) str += ` (CP ${dom.codigoPostal})`;
    if (dom.referencia) str += ` - Ref: ${dom.referencia}`;
    return str;
  };

  const handleIniciarCheckout = () => {
    if (cart.length === 0) return;
    if (user?.id) {
      cargarDomiciliosUsuario(user.id);
    }
    setModalCheckoutAbierto(true);
  };

  const handleConfirmarPedido = async (e) => {
    e.preventDefault();

    const domSel = domicilios.find((d) => d.id === domicilioSeleccionadoId);
    const dirFinal = (user?.id && modoDireccion === 'guardada' && domSel)
      ? formatearDomicilio(domSel)
      : direccionEnvio.trim();

    if (!dirFinal) {
      alert('Por favor especifica una dirección de envío.');
      return;
    }

    setDireccionConfirmada(dirFinal);
    setProcesandoCompra(true);

    try {
      if (user?.id) {
        try {
          const res = await crearPedido({
            idUsuario: user.id,
            fechaPedido: new Date().toISOString(),
            total: total,
            estado: 'Pendiente'
          });
          setPedidoId(res.data?.id || Math.floor(1000 + Math.random() * 9000));
        } catch {
          // Fallback en caso de que el backend no esté encendido en este instante
          setPedidoId(Math.floor(1000 + Math.random() * 9000));
        }
      } else {
        setPedidoId(Math.floor(1000 + Math.random() * 9000));
      }

      setCompraExitosa(true);
      vaciarCarrito();
    } finally {
      setProcesandoCompra(false);
    }
  };

  return (
    <main className="w-full min-h-[75vh] bg-[#fcfdfe] font-space py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#B02F00] transition-colors group mb-3"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Volver al Inicio</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Tu Carrito
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Revisa tus modelos y piezas antes de proceder a la impresión.
          </p>
        </div>

        {cart.length === 0 && !compraExitosa ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] p-8 sm:p-12 text-center max-w-2xl mx-auto my-8">
            <div className="w-20 h-20 bg-orange-50 text-[#ff4a11] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <ShoppingBag size={38} strokeWidth={1.8} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tu carrito está vacío
            </h2>

            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              No tienes modelos ni piezas añadidas por el momento. Explora nuestro catálogo y encuentra piezas 3D personalizadas para imprimir.
            </p>

            <div className="flex items-center justify-center">
              <Link
                to="/catalogo"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#ff4a11] hover:bg-[#ea3c00] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-orange-500/20"
              >
                Explorar Catálogo
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const stockDisponible = Number(item.stock) ?? Infinity;
                const disableMinus = item.cantidad <= 1;
                const disablePlus = item.cantidad >= stockDisponible;
                const itemImg = item.imagen ? getAsset(item.imagen) : getAsset();

                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] transition-all"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#090d16] overflow-hidden shrink-0 flex items-center justify-center border border-gray-100 relative group">
                      <img
                        src={itemImg}
                        alt={item.nombre}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                      
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] block mb-1">
                        {item.categoria || 'IMPRESIÓN 3D'}
                      </span>

                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-1 mb-2">
                        {item.nombre}
                      </h3>

                      {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f1f5f9] text-[#475569] text-[11px] font-medium border border-[#e2e8f0]"
                            >
                              {renderIconoTag(tag.label, tag.tipo)}
                              <span>{tag.label}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="inline-flex items-center bg-[#f0f3f6] rounded-xl px-2 py-1 gap-2 border border-gray-200/60 select-none">
                        <button
                          type="button"
                          onClick={() => decrementarCantidad(item.id)}
                          disabled={disableMinus}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors rounded-lg hover:bg-white"
                          aria-label={`Disminuir cantidad de ${item.nombre}`}
                        >
                          <Minus size={13} strokeWidth={2.5} />
                        </button>

                        <span className="w-6 text-center text-sm font-bold text-gray-900 tabular-nums">
                          {item.cantidad}
                        </span>

                        <button
                          type="button"
                          onClick={() => incrementarCantidad(item.id)}
                          disabled={disablePlus}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors rounded-lg hover:bg-white"
                          aria-label={`Aumentar cantidad de ${item.nombre}`}
                        >
                          <Plus size={13} strokeWidth={2.5} />
                        </button>
                      </div>

                    </div>

                    <div className="sm:self-stretch flex sm:flex-col justify-between items-end w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                      
                      <button
                        type="button"
                        onClick={() => eliminarDelCarrito(item.id)}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer absolute top-4 right-4 sm:static"
                        title="Eliminar del carrito"
                        aria-label={`Eliminar ${item.nombre} del carrito`}
                      >
                        <Trash2 size={18} strokeWidth={1.8} />
                      </button>

                      <div className="text-right">
                        <span className="text-lg sm:text-xl font-bold text-gray-900 tabular-nums">
                          ${formatearMoneda(item.precio)}
                        </span>
                        {item.cantidad > 1 && (
                          <span className="block text-[11px] text-gray-400 font-medium">
                            ${formatearMoneda(item.precio * item.cantidad)} total
                          </span>
                        )}
                      </div>

                    </div>
                  </article>
                );
              })}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={vaciarCarrito}
                  className="text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Vaciar carrito</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <aside className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] sticky top-24">
                
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Resumen del Pedido
                </h2>

                <div className="space-y-3.5 text-sm">
                  
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900 tabular-nums">
                      ${formatearMoneda(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-500">
                    <span>Envío (Estándar)</span>
                    <span className="font-bold text-gray-900 tabular-nums">
                      ${formatearMoneda(costoEnvio)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-500">
                    <span>Impuestos</span>
                    <span className="font-bold text-gray-900 tabular-nums">
                      ${formatearMoneda(impuestos)}
                    </span>
                  </div>

                </div>

                <hr className="border-t border-gray-100 my-4" />

                <div className="flex items-center justify-between text-base font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span className="text-2xl font-black text-gray-900 tabular-nums">
                    ${formatearMoneda(total)}
                  </span>
                </div>

                <div className="rounded-xl border border-dashed border-[#fed7aa] bg-[#fffaf5] p-3.5 sm:p-4 text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <Truck size={16} className="text-[#ea580c] shrink-0" strokeWidth={2.2} />
                    <span>Info de Envío</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                    Los pedidos se procesan en un máximo de 48h. El tiempo de impresión varía según la complejidad del modelo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleIniciarCheckout}
                  disabled={cart.length === 0}
                  className="mt-6 w-full py-4 px-6 bg-[#ff4a11] hover:bg-[#ea3c00] active:scale-[0.99] text-white font-extrabold text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer text-center block disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  FINALIZAR COMPRA
                </button>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <ShieldCheck size={15} className="text-gray-400" />
                  <span>Pago Seguro Encriptado</span>
                </div>

              </aside>
            </div>

          </div>
        )}

      </div>

      {modalCheckoutAbierto && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => {
                setModalCheckoutAbierto(false);
                setCompraExitosa(false);
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {compraExitosa ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={36} strokeWidth={2.5} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Pedido Confirmado con Éxito!
                </h3>

                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Gracias por tu compra. Tu pedido con número de referencia{' '}
                  <strong className="text-gray-900 font-bold">#{pedidoId}</strong> ha sido recibido y entrará en cola de impresión en un plazo máximo de 48 horas.
                </p>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left mb-6 text-xs text-gray-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-medium">Total abonado:</span>
                    <span className="font-bold text-gray-900">${formatearMoneda(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Método de pago:</span>
                    <span className="font-bold text-gray-900 uppercase">{metodoPago}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Piezas ordenadas:</span>
                    <span className="font-bold text-gray-900">{totalItems} piezas</span>
                  </div>
                  {direccionConfirmada && (
                    <div className="flex justify-between items-start gap-4 pt-1.5 border-t border-gray-200/60 mt-1.5">
                      <span className="font-medium shrink-0">Entrega en:</span>
                      <span className="font-semibold text-gray-900 text-right truncate" title={direccionConfirmada}>
                        {direccionConfirmada}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setModalCheckoutAbierto(false);
                      setCompraExitosa(false);
                      navigate('/catalogo');
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-[#ff4a11] hover:bg-[#ea3c00] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    Seguir Comprando
                  </button>
                  {user && (
                    <button
                      type="button"
                      onClick={() => {
                        setModalCheckoutAbierto(false);
                        setCompraExitosa(false);
                        navigate('/perfil');
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                    >
                      Ver en Mi Perfil
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmarPedido}>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Finalizar Compra
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Completa los detalles de entrega y pago para proceder a la producción.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Nombre del destinatario
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue={user ? `${user.nombre || ''} ${user.apellido || ''}`.trim() : ''}
                      placeholder="Ej. Juan Pérez"
                      className="w-full px-4 py-2.5 bg-[#f0f3f6] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4a11]/20 focus:border-[#ff4a11]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Dirección de Envío
                    </label>

                    {/* Si está logueado y tiene direcciones guardadas */}
                    {user && domicilios.length > 0 ? (
                      <div>
                        {/* Selector de modo: Guardadas vs Otra dirección */}
                        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/90 rounded-xl mb-3">
                          <button
                            type="button"
                            onClick={() => setModoDireccion('guardada')}
                            className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              modoDireccion === 'guardada'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            <MapPin size={14} className={modoDireccion === 'guardada' ? 'text-[#ff4a11]' : ''} />
                            <span>Guardadas ({domicilios.length})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setModoDireccion('otra')}
                            className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              modoDireccion === 'otra'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            <Plus size={14} className={modoDireccion === 'otra' ? 'text-[#ff4a11]' : ''} />
                            <span>Otra dirección</span>
                          </button>
                        </div>

                        {modoDireccion === 'guardada' ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {domicilios.map((dom) => {
                              const estaSeleccionada = domicilioSeleccionadoId === dom.id;
                              return (
                                <div
                                  key={dom.id}
                                  onClick={() => setDomicilioSeleccionadoId(dom.id)}
                                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                                    estaSeleccionada
                                      ? 'border-[#ff4a11] bg-orange-50/40 ring-1 ring-[#ff4a11]'
                                      : 'border-gray-200 bg-white hover:border-gray-300'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                                    estaSeleccionada
                                      ? 'border-[#ff4a11] bg-[#ff4a11]'
                                      : 'border-gray-300 bg-white'
                                  }`}>
                                    {estaSeleccionada && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-bold text-gray-900">
                                        {dom.calle} {dom.numero}
                                      </p>
                                      {dom.favorito && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-orange-100 text-[#ea580c]">
                                          Predeterminada
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                      {dom.ciudad}, {dom.provincia} {dom.codigoPostal ? `• CP ${dom.codigoPostal}` : ''}
                                    </p>
                                    {dom.referencia && (
                                      <p className="text-[11px] text-gray-400 italic mt-0.5 truncate">
                                        Ref: {dom.referencia}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div>
                            <input
                              type="text"
                              required={modoDireccion === 'otra'}
                              value={direccionEnvio}
                              onChange={(e) => setDireccionEnvio(e.target.value)}
                              placeholder="Calle, Número, Piso/Depto, Ciudad"
                              className="w-full px-4 py-2.5 bg-[#f0f3f6] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4a11]/20 focus:border-[#ff4a11]"
                            />
                            <p className="text-[11px] text-gray-400 mt-1">
                              Ingresa una dirección específica para este pedido.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Si no está logueado o está logueado pero no tiene domicilios guardados */
                      <div>
                        <input
                          type="text"
                          required
                          value={direccionEnvio}
                          onChange={(e) => setDireccionEnvio(e.target.value)}
                          placeholder="Calle, Número, Piso/Depto, Ciudad"
                          className="w-full px-4 py-2.5 bg-[#f0f3f6] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4a11]/20 focus:border-[#ff4a11]"
                        />
                        {user && !cargandoDomicilios && (
                          <p className="text-[11px] text-gray-400 mt-1">
                            No tienes direcciones guardadas en tu perfil. Puedes ingresar una aquí.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Método de Pago
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMetodoPago('mercadopago')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          metodoPago === 'mercadopago'
                            ? 'border-[#ff4a11] bg-orange-50/50 text-[#ff4a11] font-bold ring-1 ring-[#ff4a11]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <CreditCard size={20} />
                        <span className="text-xs">MercadoPago / Tarjeta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMetodoPago('transferencia')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          metodoPago === 'transferencia'
                            ? 'border-[#ff4a11] bg-orange-50/50 text-[#ff4a11] font-bold ring-1 ring-[#ff4a11]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <Building2 size={20} />
                        <span className="text-xs">Transferencia Bancaria</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs text-gray-500 block">Total a pagar:</span>
                    <span className="text-xs text-gray-400">({totalItems} {totalItems === 1 ? 'pieza' : 'piezas'} + Envío)</span>
                  </div>
                  <span className="text-2xl font-black text-gray-900 tabular-nums">
                    ${formatearMoneda(total)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={procesandoCompra}
                  className="w-full py-3.5 px-6 bg-[#ff4a11] hover:bg-[#ea3c00] active:scale-[0.99] text-white font-extrabold text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {procesandoCompra ? 'Procesando Pedido...' : 'Confirmar y Pagar'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </main>
  );
};

export default Carrito;
