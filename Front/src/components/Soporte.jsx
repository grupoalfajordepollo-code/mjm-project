import { useState } from "react";
import { Link } from "react-router-dom";
import {
  PackageSearch,
  Truck,
  CreditCard,
  FileBox,
  RefreshCw,
  UserCheck,
  MessageSquare,
  LifeBuoy,
  ArrowLeft,
  ChevronRight,
  Mail,
  Clock,
} from "lucide-react";

const SECCIONES = [
  {
    id: "pedidos",
    titulo: "1. Pedidos y Seguimiento",
    icono: PackageSearch,
    contenido: (
      <>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">¿Cómo sé el estado de mi pedido?</span>
            <p>
              Iniciá sesión y entrá a <strong>Perfil → Mis pedidos</strong>. Allí vas a ver cada orden con su
              estado actualizado: <em>pendiente</em>, <em>en producción</em>, <em>despachado</em> o{" "}
              <em>entregado</em>. Cuando el paquete sale de nuestro taller, recibís un correo con el
              número de seguimiento del operador logístico.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">¿Puedo modificar o cancelar un pedido?</span>
            <p>
              Sí, mientras el estado sea <em>pendiente</em> o <em>en producción</em> y la pieza no haya
              ingresado a la máquina de impresión. Escribinos a{" "}
              <a href="mailto:soporte@mjm3d.com" className="text-[#B02F00] font-bold hover:underline">
                soporte@mjm3d.com
              </a>{" "}
              indicando el número de orden. Una vez iniciada la fabricación de una pieza personalizada,
              el pedido ya no admite cancelación (ver Términos y Condiciones, sección 6).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">No recibí el correo de confirmación</span>
            <p>
              Revisá la carpeta de <strong>correo no deseado / spam</strong>. Si no está, verificá que
              hayas escrito correctamente tu email al registrarte. Como último paso, escribinos desde
              el correo con el que te registraste y reenviamos la confirmación.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "envios",
    titulo: "2. Envíos y Entregas",
    icono: Truck,
    contenido: (
      <>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">¿A dónde envían y cuánto tarda?</span>
            <p>
              Despachamos a toda la República Argentina. Los plazos estimados son de{" "}
              <strong>24 a 48 horas hábiles</strong> para productos en stock una vez confirmado el pago,
              más el tiempo de tránsito del operador (24-72 hs según destino). Para piezas a medida,
              sumale el tiempo de fabricación indicado en la ficha del producto o en tu presupuesto.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">¿Cómo empaquetan las piezas impresas?</span>
            <p>
              Cada pieza viaja protegida con relleno de espuma o papel kraft, en caja rígida con
              separadores. Las piezas frágiles o de gran eslanse se imprimen con soportes de
              impresión removibles y se envían desarmadas cuando corresponde. El embalaje está
              incluido en el precio del envío.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">El tracking no se actualiza hace días</span>
            <p>
              Los operadores pueden demorar hasta 48 hs en reflejar movimientos intermedios. Si pasaron
              más de 5 días hábiles sin novedad y el plazo estimado ya venció, escribinos con el número
              de orden y abrimos una investigación formal con la mensajería.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "pagos",
    titulo: "3. Pagos y Facturación",
    icono: CreditCard,
    contenido: (
      <>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">¿Qué medios de pago aceptan?</span>
            <p>
              Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express) a través de
              nuestra pasarela certificada PCI-DSS, además de transferencia bancaria y otros medios
              habilitados que se muestran en el checkout. Las cuotas sin interés dependen de la
              promoción vigente de cada emisor.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">¿Emiten factura?</span>
            <p>
              Sí. Al finalizar la compra podés solicitar factura <strong>B</strong> (consumidor final) o{" "}
              <strong>A</strong> (responsable inscripto, requiere CUIT). La factura se envía por correo
              electrónico junto a la confirmación del pedido. Si necesitás datos adicionales para tu
              contabilidad, indicalos en las observaciones del checkout.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">El pago fue rechazado, ¿qué hago?</span>
            <p>
              Verificá fondos disponibles, límites de compra online y que los datos de la tarjeta
              estén correctos. Si el rechazo persiste, probá otro medio de pago o contactá a tu banco.
              Nunca almacenamos datos completos de tu tarjeta: la operación se procesa íntegramente en
              la pasarela.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "personalizados",
    titulo: "4. Productos Personalizados (STL)",
    icono: FileBox,
    contenido: (
      <>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">¿Cómo envío mi archivo para imprimir?</span>
            <p>
              Podés adjuntar archivos <strong>STL, STEP o 3MF</strong> desde la ficha del producto de
              servicio de impresión a medida, o responder al correo de presupuesto. Tamaño máximo de
              50 MB por archivo. Si el modelo pesa más, comprimilo en .ZIP o compartinos un link de
              descarga (Drive, WeTransfer, etc.).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">¿Qué material y resolución eligen ustedes?</span>
            <p>
              Por defecto imprimimos en <strong>PLA</strong> a 0.2 mm de altura de capa. Si tu pieza
              necesita PETG, ABS, TPU o una resolución mayor (0.12 mm o 0.08 mm), indicalo en el
              comentario del pedido o consultanos antes de confirmar: el material impacta en precio y
              plazo.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Mi diseño necesita soportes, ¿lo tienen en cuenta?</span>
            <p>
              Sí. Evaluamos automáticamente cada malla y generamos soportes donde la geometría lo
              requiera. Si el diseño tiene zonas críticas (puentes largos, voladizos), te enviamos una
              foto del render antes de imprimir para que valides la orientación. Los soportes se
              remueven y lijan a mano sin costo adicional.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "garantias",
    titulo: "5. Garantías, Cambios y Devoluciones",
    icono: RefreshCw,
    contenido: (
      <>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">La pieza llegó dañada, ¿qué hago?</span>
            <p>
              Fotografiá el paquete exterior y la pieza dañada dentro de las <strong>48 horas</strong>{" "}
              posteriores a la recepción, y escribinos a soporte@mjm3d.com con el número de orden.
              Si el daño es atribuible al transporte o a un defecto de fabricación, reponemos la pieza
              sin costo. No hace falta devolver el producto dañado en la mayoría de los casos.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">¿Puedo cambiar una talla/color/material?</span>
            <p>
              En productos personalizados (impresos según tu archivo o especificación), no: cada pieza
              es irrepetible y ya fue fabricada para vos. En filamentos y accesorios sin abrir, sí,
              dentro de los 10 días de recibido y con el sello de seguridad intacto.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">¿Cuánto tarda el reembolso?</span>
            <p>
              Una vez aprobada la devolución o garantía, el reembolso se procesa en un máximo de{" "}
              <strong>5 días hábiles</strong> al medio de pago original. El tiempo de acreditación
              posterior depende de tu entidad bancaria (hasta 2 ciclos de resumen).
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "cuenta",
    titulo: "6. Cuenta y Seguridad",
    icono: UserCheck,
    contenido: (
      <>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Olvidé mi contraseña</span>
            <p>
              En la pantalla de ingreso, hacé click en <strong>"¿Olvidaste tu contraseña?"</strong> y
              seguí el link que recibís por correo. El link es válido por 30 minutos. Si no llega,
              revisá spam o escribinos desde el correo registrado.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">¿Cómo protegen mis datos?</span>
            <p>
              Todo el tráfico del sitio va cifrado por TLS/SSL (HTTPS). Las contraseñas se guardan
              como hash irreversible. No compartimos tus datos con terceros salvo los operadores
              necesarios para el pago y la entrega. Podés leer el detalle completo en nuestra{" "}
              <Link to="/privacidad" className="text-[#B02F00] font-bold hover:underline">
                Política de Privacidad
              </Link>
              .
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Quiero eliminar mi cuenta</span>
            <p>
              Escribinos a soporte@mjm3d.com desde el correo registrado con el asunto{" "}
              <strong>"Baja de cuenta"</strong>. Procesamos la eliminación de datos personales dentro
              de los 10 días hábiles, salvo la información que debamos retener por obligación legal
              (facturas, historial de compras).
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "contacto",
    titulo: "7. Contacto Directo",
    icono: MessageSquare,
    contenido: (
      <>
        <p>
          ¿No encontraste la respuesta que buscabas? Nuestro equipo técnico y comercial atiende de
          lunes a viernes de <strong>9:00 a 18:00 (ART)</strong>. Promedio de primera respuesta:{" "}
          <strong>24 horas hábiles</strong>.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-[#fff8f5] border border-[#f5d5c8]">
            <span className="font-bold text-[#8a2500] block mb-1">Soporte técnico y pedidos</span>
            <a href="mailto:soporte@mjm3d.com" className="text-[#B02F00] font-bold hover:underline">
              soporte@mjm3d.com
            </a>
            <p className="mt-1 text-gray-600">Consultas sobre piezas, seguimiento, garantías.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#fff8f5] border border-[#f5d5c8]">
            <span className="font-bold text-[#8a2500] block mb-1">Datos personales y privacidad</span>
            <a href="mailto:datos@mjm3d.com" className="text-[#B02F00] font-bold hover:underline">
              datos@mjm3d.com
            </a>
            <p className="mt-1 text-gray-600">Derechos ARCO, acceso, rectificación, supresión.</p>
          </div>
        </div>
      </>
    ),
  },
];

const Soporte = () => {
  const [seccionActiva, setSeccionActiva] = useState(SECCIONES[0].id);

  const irASeccion = (id) => {
    setSeccionActiva(id);
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="w-full bg-[#f8f9fb] font-space py-10 md:py-16 min-h-[75vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-500 hover:text-[#B02F00] transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al Inicio
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef5f2] border border-[#f5e3dc] text-xs font-semibold text-[#B02F00]">
            <LifeBuoy size={13} />
            Help Center
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#e6d5cc] p-8 md:p-12 mb-8 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#B02F00] opacity-5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold text-[#B02F00] uppercase tracking-wider mb-2 block">
              Centro de Ayuda
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Soporte al Cliente
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Encontrá respuestas rápidas sobre pedidos, envíos, pagos y productos personalizados. Si
              tu consulta no está acá, nuestro equipo responde en menos de 24 horas hábiles.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400 font-medium">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                Lun a Vie · 9:00–18:00 (ART)
              </span>
              <span>•</span>
              <span>Respuesta ≤ 24 hs hábiles</span>
              <span>•</span>
              <span>soporte@mjm3d.com</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <aside className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-2xl border border-[#e6d5cc] p-5 shadow-sm">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 px-2">
                Categorías de Ayuda
              </h2>
              <nav className="space-y-1">
                {SECCIONES.map((sec) => {
                  const Icon = sec.icono;
                  const esActiva = seccionActiva === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => irASeccion(sec.id)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        esActiva
                          ? "bg-[#fef5f2] text-[#B02F00] border border-[#f5e3dc] shadow-xs"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate min-w-0">
                        <Icon size={16} className={esActiva ? "text-[#B02F00]" : "text-gray-400"} />
                        <span className="truncate">{sec.titulo}</span>
                      </div>
                      <ChevronRight size={14} className={`shrink-0 ${esActiva ? "text-[#B02F00]" : "text-gray-300"}`} />
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-5 border-t border-gray-100 px-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                  <Mail size={15} className="text-[#B02F00]" />
                  ¿Necesitás hablar con alguien?
                </div>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Nuestro equipo responde consultas técnicas y comerciales durante el horario hábil.
                </p>
                <a
                  href="mailto:soporte@mjm3d.com"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B02F00] hover:underline"
                >
                  <Mail size={13} />
                  soporte@mjm3d.com
                </a>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-6">
            {SECCIONES.map((sec) => {
              const Icon = sec.icono;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  onMouseEnter={() => setSeccionActiva(sec.id)}
                  className="bg-white rounded-2xl border border-[#e6d5cc] p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all hover:border-[#cfb7aa] scroll-mt-28"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-lg bg-[#fef5f2] border border-[#f5e3dc] flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#B02F00]" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {sec.titulo}
                    </h2>
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {sec.contenido}
                  </div>
                </section>
              );
            })}

            <div className="rounded-2xl bg-linear-to-r from-[#1a1c1e] to-[#2b2d30] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold">¿Listo para comenzar a imprimir tus ideas?</h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Explorá nuestro catálogo de piezas técnicas, filamentos y accesorios de alta calidad.
                </p>
              </div>
              <Link
                to="/catalogo"
                className="cursor-pointer shrink-0 px-5 py-2.5 bg-[#B02F00] hover:bg-[#8a2500] text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-sm"
              >
                Ver Catálogo
              </Link>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
};

export default Soporte;
