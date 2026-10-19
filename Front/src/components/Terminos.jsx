import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  ShieldCheck, 
  Layers, 
  Truck, 
  RefreshCw, 
  UserCheck, 
  Scale, 
  HelpCircle, 
  ChevronRight,
  ArrowLeft,
  Mail
} from "lucide-react";

const SECCIONES = [
  {
    id: "objeto",
    titulo: "1. Objeto y Alcance del Servicio",
    icono: FileText,
    contenido: (
      <>
        <p>
          El presente documento establece las condiciones contractuales y de uso que rigen el acceso y la adquisición de productos o servicios ofrecidos a través de la plataforma digital oficial de <strong>MJM 3D Marketplace</strong>.
        </p>
        <p className="mt-3">
          Nuestra actividad comprende la comercialización de piezas fabricadas mediante tecnología de manufactura aditiva (impresión 3D FDM / SLA), filamentos técnicos, repuestos de grado industrial, componentes electrónicos, accesorios para makers y servicios de diseño o prototipado a medida.
        </p>
        <div className="mt-4 p-4 rounded-xl bg-[#fff8f5] border border-[#f5d5c8] text-xs text-[#8a2500] leading-relaxed">
          Al navegar por el sitio, registrar una cuenta o generar una orden de compra, el usuario declara haber leído, comprendido y aceptado en su totalidad estos Términos y Condiciones.
        </div>
      </>
    ),
  },
  {
    id: "cuentas",
    titulo: "2. Cuentas de Usuario y Seguridad",
    icono: UserCheck,
    contenido: (
      <>
        <p>
          Para efectuar compras, gestionar pedidos y acceder al historial de transacciones, el usuario debe crear una cuenta personal facilitando datos verídicos, exactos y actualizados.
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
          <li>El usuario es el único responsable de preservar la confidencialidad de sus credenciales de acceso y contraseña.</li>
          <li>Cualquier operación efectuada desde una cuenta autenticada se presumirá realizada por su titular legítimo.</li>
          <li>MJM 3D se reserva el derecho de suspender o inhabilitar cuentas que suministren información apócrifa o hagan un uso lesivo del sistema.</li>
        </ul>
      </>
    ),
  },
  {
    id: "manufactura",
    titulo: "3. Naturaleza de la Manufactura Aditiva",
    icono: Layers,
    contenido: (
      <>
        <p>
          La tecnología de impresión 3D (FDM y resina) construye objetos capa por capa a partir de polímeros termoplásticos o resinas fotosensibles. Debido a la naturaleza física inherente a este proceso de fabricación:
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Textura y Líneas de Capa</span>
            Es normal percibir líneas de deposición superficiales y leves micro-variaciones que no comprometen la integridad estructural.
          </div>
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Tolerancias Dimensionales</span>
            Nuestras piezas se producen bajo estándares de precisión técnica con tolerancias estándar habituales de ±0.2 mm a ±0.4 mm.
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          En productos personalizados o bajo demanda (archivos STL/STEP provistos por el cliente), el cliente certifica poseer los derechos de propiedad intelectual del diseño.
        </p>
      </>
    ),
  },
  {
    id: "precios-pagos",
    titulo: "4. Precios, Facturación y Medios de Pago",
    icono: Scale,
    contenido: (
      <>
        <p>
          Todos los precios exhibidos en el catálogo están expresados en moneda de curso legal (ARS) e incluyen los gravámenes correspondientes, salvo indicación expresa en contrario.
        </p>
        <p className="mt-3">
          Los precios pueden sufrir modificaciones sin previo aviso; no obstante, se respetará de forma irrestricta el importe vigente al momento de confirmación formal del pedido. Las transacciones se procesan a través de pasarelas de pago seguras y encriptadas con protocolos TLS/SSL de alta seguridad.
        </p>
      </>
    ),
  },
  {
    id: "envios",
    titulo: "5. Envíos, Plazos de Producción y Entrega",
    icono: Truck,
    contenido: (
      <>
        <p>
          Los productos en stock inmediato son despachados en un lapso estimado de 24 a 48 horas hábiles. En piezas a pedido o proyectos de impresión personalizada, el tiempo de entrega comprende:
        </p>
        <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
          <p><strong>1. Tiempo de fabricación / curado:</strong> Estipulado en la ficha técnica del producto o acordado en el presupuesto técnico.</p>
          <p><strong>2. Tiempo de tránsito logístico:</strong> Dependiente del operador de correo o mensajería seleccionado en el checkout.</p>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          El cliente recibirá un código de seguimiento online apenas el paquete sea admitido por la empresa logística.
        </p>
      </>
    ),
  },
  {
    id: "garantia",
    titulo: "6. Garantía, Devoluciones y Cancelaciones",
    icono: RefreshCw,
    contenido: (
      <>
        <p>
          Respaldamos la calidad de cada producto con una política transparente:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
          <li><strong>Defectos de fabricación:</strong> Garantía legal de 30 días corridos desde la recepción ante roturas por fatiga de material anómala o fallas de laminación.</li>
          <li><strong>Filamentos y repuestos:</strong> Se aceptan cambios siempre que el embalaje original al vacío permanezca intacto y con sus sellos de seguridad sin vulnerar.</li>
          <li><strong>Piezas a medida:</strong> Al ser productos manufacturados según especificaciones exclusivas e irrepetibles, no admiten revocación de compra una vez iniciada la fase de impresión, salvo defecto insalvable atribuible a MJM 3D.</li>
        </ul>
      </>
    ),
  },
  {
    id: "responsabilidad",
    titulo: "7. Limitación de Responsabilidad",
    icono: ShieldCheck,
    contenido: (
      <>
        <p>
          MJM 3D no se responsabiliza por daños directos o indirectos derivados del uso incorrecto, sobreexposición térmica indebida (por encima de la temperatura de transición vítrea del polímero empleado, ej. PLA expuesto al sol directo dentro de vehículos), o aplicación de esfuerzos mecánicos superiores a los recomendados en la ficha técnica.
        </p>
        <p className="mt-3">
          Salvo indicación específica con polímeros grado alimenticio o biocompatibles certificados, las piezas decorativas estándar no son aptas para contacto directo y prolongado con alimentos ni para implantes médicos.
        </p>
      </>
    ),
  },
];

const Terminos = () => {
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
        
        {/* Navegación y Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-500 hover:text-[#B02F00] transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al Inicio
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef5f2] border border-[#f5e3dc] text-xs font-semibold text-[#B02F00]">
            <Scale size={13} />
            Legal · Términos
          </span>
        </div>

        {/* Encabezado principal */}
        <div className="bg-white rounded-3xl border border-[#e6d5cc] p-8 md:p-12 mb-8 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#B02F00] opacity-5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold text-[#B02F00] uppercase tracking-wider mb-2 block">
              Marco Regulatorio
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Términos y Condiciones de Uso
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Bienvenido a <strong>MJM 3D Marketplace</strong>. Aquí detallamos las normas, garantías y compromisos que regulan la compra de productos, filamentos y servicios de manufactura aditiva técnica.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400 font-medium">
              <span>Versión vigente: 2.1</span>
              <span>•</span>
              <span>Última revisión: Octubre 2026</span>
              <span>•</span>
              <span>Válido para la República Argentina</span>
            </div>
          </div>
        </div>

        {/* Barra de navegación rápida en móviles (Horizontal Scroll Chips) */}
        <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto scrollbar-none flex gap-2 pb-2">
          {SECCIONES.map((sec) => {
            const Icon = sec.icono;
            const esActiva = seccionActiva === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => irASeccion(sec.id)}
                className={`whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  esActiva
                    ? "bg-[#B02F00] text-white shadow-xs"
                    : "bg-white text-gray-700 border border-[#e6d5cc] hover:bg-gray-50"
                }`}
              >
                <Icon size={14} className={esActiva ? "text-white" : "text-gray-400"} />
                <span>{sec.titulo.split(". ")[1] || sec.titulo}</span>
              </button>
            );
          })}
        </div>

        {/* Layout en dos columnas: Índice lateral sticky en desktop + Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navegación lateral Sticky solo en pantallas grandes (lg+) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-2xl border border-[#e6d5cc] p-5 shadow-sm">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 px-2">
                Índice de Secciones
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
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon size={16} className={esActiva ? "text-[#B02F00]" : "text-gray-400"} />
                        <span className="truncate">{sec.titulo}</span>
                      </div>
                      <ChevronRight size={14} className={`shrink-0 ${esActiva ? "text-[#B02F00]" : "text-gray-300"}`} />
                    </button>
                  );
                })}
              </nav>

              {/* Caja de ayuda rápida */}
              <div className="mt-6 pt-5 border-t border-gray-100 px-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                  <HelpCircle size={15} className="text-[#B02F00]" />
                  ¿Dudas sobre un pedido?
                </div>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Nuestro equipo técnico está listo para asistirte ante cualquier consulta sobre especificaciones o materiales.
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

          {/* Bloques de contenido detallado */}
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

            {/* Banner de llamada a la acción */}
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

export default Terminos;