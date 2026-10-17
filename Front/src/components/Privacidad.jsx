import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Database,
  Filter,
  Handshake,
  FileText,
  Cookie,
  Clock,
  ShieldCheck,
  UserRoundX,
  Scale,
  Mail,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

const SECCIONES = [
  {
    id: "datos",
    titulo: "1. Datos que Recopilamos",
    icono: Database,
    contenido: (
      <>
        <p>
          Para operar como Marketplace y brindarte una experiencia segura, MJM 3D
          recopila exclusivamente los datos personales necesarios para cada
          interacción, conforme al principio de minimización previsto por la Ley
          N.º 25.326 de Protección de Datos Personales (República Argentina).
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Datos de registro y cuenta</span>
            Nombre y apellido, correo electrónico, número de teléfono, documento de identidad y contraseña cifrada.
          </div>
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Datos de envío y facturación</span>
            Domicilio físico, código postal, razón social y CUIT cuando se solicita factura A o B.
          </div>
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Datos transaccionales</span>
            Historial de pedidos, métodos de pago asociados (tokenizados), importes y estado de cada orden.
          </div>
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">Datos de navegación</span>
            Dirección IP, tipo de dispositivo y navegador, páginas visitadas y cookies estrictamente necesarias.
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          MJM 3D no almacena números completos de tarjetas de crédito ni códigos de
          seguridad (CVV). Dichos datos son procesados directamente por la pasarela
          de pago certificada PCI-DSS habilitada en el checkout.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    titulo: "2. Para qué Usamos tus Datos",
    icono: Filter,
    contenido: (
      <>
        <p>Cada categoría de dato se utiliza para una finalidad específica y declarada:</p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
          <li><strong>Ejecución del contrato de compraventa:</strong> procesar tu orden, cobrar, facturar y despachar los productos adquiridos.</li>
          <li><strong>Gestión de la relación comercial:</strong> administrar tu cuenta, historial de pedidos, garantías y devoluciones.</li>
          <li><strong>Atención postventa y soporte:</strong> responder consultas técnicas sobre materiales, tolerancias y seguimiento de envíos.</li>
          <li><strong>Prevención del fraude:</strong> detectar operaciones atípicas o fraudulentas mediante monitoreo automatizado de patrones.</li>
          <li><strong>Mejora del servicio:</strong> elaboración de estadísticas agregadas y anónimas de uso del catálogo.</li>
          <li><strong>Comunicaciones comerciales:</strong> envío de novedades y promociones únicamente si otorgaste tu consentimiento expreso e indubitable al registrarte o suscribirte.</li>
        </ul>
      </>
    ),
  },
  {
    id: "terceros",
    titulo: "3. Encargados y Transferencias a Terceros",
    icono: Handshake,
    contenido: (
      <>
        <p>
          MJM 3D no vende ni alquila tus datos personales a terceros bajo ninguna
          circunstancia. El tratamiento se limita a los prestadores de servicio
          estrictamente necesarios para operar el Marketplace, quienes actúan como
          encargados del tratamiento bajo contratos de confidencialidad:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
          <li><strong>Pasarelas de pago:</strong> procesamiento seguro de transacciones (ej. Mercado Pago u otras habilitadas), conforme a sus propias políticas y estándares PCI-DSS.</li>
          <li><strong>Operadores logísticos y correo:</strong> únicamente los datos de destinación necesarios para la entrega del paquete.</li>
          <li><strong>Proveedores de infraestructura tecnológica:</strong> hosting, base de datos y servicios de correo transaccional bajo acuerdos de nivel de servicio y seguridad.</li>
        </ul>
        <div className="mt-4 p-4 rounded-xl bg-[#fff8f5] border border-[#f5d5c8] text-xs text-[#8a2500] leading-relaxed">
          Cuando un servicio implique una transferencia internacional de datos, la
          misma se realizará a jurisdicciones con nivel de protección adecuado o
          con las garantías contractuales exigidas por la normativa vigente.
        </div>
      </>
    ),
  },
  {
    id: "cookies",
    titulo: "4. Cookies y Tecnologías Similares",
    icono: Cookie,
    contenido: (
      <>
        <p>Utilizamos cookies estrictamente clasificadas en tres categorías:</p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
          <li><strong>Necesarias:</strong> indispensables para el funcionamiento del sitio (sesión autenticada, contenido del carrito). No requieren consentimiento.</li>
          <li><strong>Preferencias:</strong> recuerdan configuraciones como la moneda o los filtros del catálogo aplicados en tu última visita.</li>
          <li><strong>Analíticas:</strong> nos permiten comprender de forma agregada cómo se utiliza la plataforma para mejorarla. Se instalan solo con tu consentimiento previo.</li>
        </ul>
        <p className="mt-3">
          Podés administrar o bloquear las cookies desde la configuración de tu
          navegador en cualquier momento. Tené en cuenta que desactivar las cookies
          necesarias puede impedir el correcto funcionamiento del carrito y del checkout.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    titulo: "5. Conservación de la Información",
    icono: Clock,
    contenido: (
      <>
        <p>
          Conservamos tus datos personales mientras tu cuenta permanezca activa y
          durante el tiempo razonablemente necesario para las finalidades declaradas
          en esta política. Finalizado ese plazo, los datos se suprimen o se
          anonimizan de forma irrevocable.
        </p>
        <p className="mt-3">
          Determinada información transaccional se conserva por plazos mayores
          cuando exista una obligación legal de retención, tales como registros
          contables, fiscales o probatorios exigidos por la legislación argentina
          vigente.
        </p>
      </>
    ),
  },
  {
    id: "seguridad",
    titulo: "6. Seguridad de los Datos",
    icono: ShieldCheck,
    contenido: (
      <>
        <p>
          Aplicamos medidas técnicas y organizativas alineadas con estándares
          reconocidos de la industria para proteger tus datos contra acceso no
          autorizado, alteración, divulgación o destrucción:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
          <li>Cifrado obligatorio del tráfico mediante protocolo TLS/SSL (HTTPS) en todas las páginas del sitio.</li>
          <li>Contraseñas almacenadas en forma de hash con algoritmos de derivación robusta; nunca en texto plano.</li>
          <li>Segmentación de red y acceso restringido a la información personal únicamente al personal autorizado.</li>
          <li>Copias de seguridad periódicas y verificadas de la base de datos operativa.</li>
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          Ningún sistema es infalible; sin embargo, ante cualquier incidente de
          seguridad que afecte datos sensibles, notificaremos a los titulares y a
          la autoridad de control dentro de los plazos que disponga la normativa.
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    titulo: "7. Tus Derechos como Titular",
    icono: Scale,
    contenido: (
      <>
        <p>
          Como titular de datos personales, el Art. 14 de la Ley 25.326 te
          reconoce los siguientes derechos, ejercibles de forma gratuita:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
          <li><strong>Acceso:</strong> solicitar confirmación de si tratamos tus datos y obtener una copia detallada.</li>
          <li><strong>Rectificación y actualización:</strong> corregir datos inexactos o incompletos desde tu perfil o por solicitud.</li>
          <li><strong>Supresión:</strong> pedir el borrado de tus datos, salvo obligación legal de conservación.</li>
          <li><strong>Oposición y revocación:</strong> oponerte a determinados tratamientos o revocar el consentimiento otorgado en cualquier momento.</li>
          <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.</li>
        </ul>
        <div className="mt-4 p-4 rounded-xl bg-[#fff8f5] border border-[#f5d5c8] text-xs text-[#8a2500] leading-relaxed">
          Para ejercer cualquiera de estos derechos, escribinos a
          <strong> datos@mjm3d.com</strong> indicando el derecho que deseás ejercer.
          Responderemos dentro de los 10 días hábiles. Si considerás que tu derecho
          fue vulnerado, podés reclamar ante la Agencia de Acceso a la Información
          Pública (info.gob.ar), organismo de control de la Ley 25.326.
        </div>
      </>
    ),
  },
  {
    id: "menores",
    titulo: "8. Menores de Edad",
    icono: UserRoundX,
    contenido: (
      <>
        <p>
          El registro y la adquisición de productos en MJM 3D se encuentran
          reservados a personas con capacidad legal para contratar, es decir,
          mayores de 18 años. No recopilamos conscientemente datos de menores de
          edad.
        </p>
        <p className="mt-3">
          Si detectamos que se han registrado datos de un menor sin la
          intervención de su tutor legal, procederemos a su eliminación inmediata
          dentro de nuestros sistemas.
        </p>
      </>
    ),
  },
  {
    id: "cambios",
    titulo: "9. Actualizaciones de esta Política",
    icono: FileText,
    contenido: (
      <>
        <p>
          Podemos actualizar esta Política de Privacidad para reflejar cambios
          normativos, tecnológicos o en nuestros procesos comerciales. Cada versión
          será publicada en esta misma página indicando la fecha de su última
          revisión.
        </p>
        <p className="mt-3">
          Las modificaciones sustanciales que afecten derechos del usuario serán
          notificadas por correo electrónico con una antelación razonable a su
          entrada en vigencia.
        </p>
      </>
    ),
  },
];

const Privacidad = () => {
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
            <ShieldCheck size={13} />
            Legal · Privacidad
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#e6d5cc] p-8 md:p-12 mb-8 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#B02F00] opacity-5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold text-[#B02F00] uppercase tracking-wider mb-2 block">
              Protección de Datos
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Política de Privacidad
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              En <strong>MJM 3D Marketplace</strong> la confianza se construye con
              transparencia. Aquí detallamos qué datos personales tratamos, con qué
              finalidad y cómo podés ejercer tus derechos conforme a la Ley 25.326.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400 font-medium">
              <span>Versión vigente: 1.2</span>
              <span>•</span>
              <span>Última revisión: Octubre 2026</span>
              <span>•</span>
              <span>Ley 25.326 — Argentina</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <aside className="lg:col-span-4 sticky top-24">
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
                  <HelpCircle size={15} className="text-[#B02F00]" />
                  ¿Querés ejercer un derecho?
                </div>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Escribinos y gestionamos tu solicitud de acceso, rectificación o
                  supresión de datos de forma personalizada.
                </p>
                <a
                  href="mailto:datos@mjm3d.com"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B02F00] hover:underline"
                >
                  <Mail size={13} />
                  datos@mjm3d.com
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
                <h3 className="text-base sm:text-lg font-bold">¿Consultas sobre tus datos personales?</h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Nuestro equipo responde cada solicitud de privacidad en un plazo máximo de 10 días hábiles.
                </p>
              </div>
              <a
                href="mailto:datos@mjm3d.com"
                className="cursor-pointer shrink-0 px-5 py-2.5 bg-[#B02F00] hover:bg-[#8a2500] text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-sm"
              >
                Escribinos
              </a>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
};

export default Privacidad;