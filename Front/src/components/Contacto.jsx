import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquareQuote,
  ArrowLeft,
  ChevronRight,
  LifeBuoy,
  FileSignature,
  Handshake,
} from "lucide-react";

const ContactoFormulario = () => {
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "consulta-general",
    mensaje: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-14 h-14 rounded-full bg-[#fef5f2] border border-[#f5e3dc] flex items-center justify-center mb-4">
          <CheckCircle2 className="h-7 w-7 text-[#B02F00]" strokeWidth={1.8} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Mensaje registrado</h3>
        <p className="text-sm text-gray-600 max-w-md">
          Gracias por escribirnos, <strong>{form.nombre}</strong>. Nuestro equipo revisará tu consulta
          y te responderá a <strong>{form.email}</strong> dentro de las 24 horas hábiles.
        </p>
        <button
          type="button"
          onClick={() => {
            setEnviado(false);
            setForm({ nombre: "", email: "", asunto: "consulta-general", mensaje: "" });
          }}
          className="cursor-pointer mt-5 text-xs font-bold text-[#B02F00] hover:underline"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block font-bold text-gray-900 mb-1.5">
            Nombre y apellido *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            className="w-full px-3 py-2.5 bg-white border border-[#e6d5cc] rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-bold text-gray-900 mb-1.5">
            Correo electrónico *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="w-full px-3 py-2.5 bg-white border border-[#e6d5cc] rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="asunto" className="block font-bold text-gray-900 mb-1.5">
          Motivo de contacto *
        </label>
        <select
          id="asunto"
          name="asunto"
          value={form.asunto}
          onChange={handleChange}
          className="w-full px-3 py-2.5 bg-white border border-[#e6d5cc] rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all cursor-pointer"
        >
          <option value="consulta-general">Consulta general</option>
          <option value="pedido">Seguimiento de pedido</option>
          <option value="producto">Consulta sobre producto</option>
          <option value="presupuesto">Presupuesto a medida</option>
          <option value="garantia">Garantía o devolución</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div>
        <label htmlFor="mensaje" className="block font-bold text-gray-900 mb-1.5">
          Mensaje *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={5}
          value={form.mensaje}
          onChange={handleChange}
          placeholder="Contanos en detalle tu consulta. Si tenés un número de orden, incluilo acá."
          className="w-full px-3 py-2.5 bg-white border border-[#e6d5cc] rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all resize-y min-h-28"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <p className="text-[11px] text-gray-500 max-w-xs leading-relaxed">
          Al enviar aceptás nuestra{" "}
          <Link to="/privacidad" className="text-[#B02F00] font-bold hover:underline">
            Política de Privacidad
          </Link>
          . Tus datos se usan únicamente para responder esta consulta.
        </p>
        <button
          type="submit"
          className="cursor-pointer shrink-0 inline-flex items-center gap-2 px-6 py-2.5 bg-[#B02F00] hover:bg-[#8a2500] text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-sm"
        >
          <Send size={15} strokeWidth={2} />
          Enviar Mensaje
        </button>
      </div>
    </form>
  );
};

const SECCIONES = [
  {
    id: "canales",
    titulo: "1. Canales de Contacto",
    icono: MessageSquareQuote,
    contenido: (
      <>
        <p>
          Elegí el canal según el tipo de consulta. Cada bandeja es monitoreada por un equipo
          específico para darte la respuesta más rápida posible.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1 flex items-center gap-1.5">
              <Mail size={14} className="text-[#B02F00]" />
              Soporte técnico y pedidos
            </span>
            <a href="mailto:soporte@mjm3d.com" className="text-[#B02F00] font-bold hover:underline">
              soporte@mjm3d.com
            </a>
            <p className="mt-1 text-gray-600">Seguimiento de órdenes, garantías, consultas de producto.</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1 flex items-center gap-1.5">
              <Handshake size={14} className="text-[#B02F00]" />
              Comercial y presupuestos
            </span>
            <a href="mailto:comercial@mjm3d.com" className="text-[#B02F00] font-bold hover:underline">
              comercial@mjm3d.com
            </a>
            <p className="mt-1 text-gray-600">Proyectos a medida, volumen mayorista, alianzas.</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1 flex items-center gap-1.5">
              <FileSignature size={14} className="text-[#B02F00]" />
              Privacidad y datos personales
            </span>
            <a href="mailto:datos@mjm3d.com" className="text-[#B02F00] font-bold hover:underline">
              datos@mjm3d.com
            </a>
            <p className="mt-1 text-gray-600">Derechos ARCO, acceso, rectificación, supresión.</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1 flex items-center gap-1.5">
              <LifeBuoy size={14} className="text-[#B02F00]" />
              Centro de Ayuda
            </span>
            <Link to="/soporte" className="text-[#B02F00] font-bold hover:underline">
              Ver FAQ completa
            </Link>
            <p className="mt-1 text-gray-600">Respuestas inmediatas a las consultas más frecuentes.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "horarios",
    titulo: "2. Horarios y Tiempos de Respuesta",
    icono: Clock,
    contenido: (
      <>
        <p>
          Nuestro equipo atiende de <strong>lunes a viernes de 9:00 a 18:00 (ART)</strong>. Los fines
          de semana y feriados no se procesan pedidos ni se envían despachos.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 text-xs">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-2.5 font-bold">Canal</th>
                <th className="px-4 py-2.5 font-bold">Horario</th>
                <th className="px-4 py-2.5 font-bold">Primera respuesta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600">
              <tr>
                <td className="px-4 py-2.5">Email soporte</td>
                <td className="px-4 py-2.5">Lun–Vie, 9–18 h</td>
                <td className="px-4 py-2.5">≤ 24 h hábiles</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">Email comercial</td>
                <td className="px-4 py-2.5">Lun–Vie, 9–18 h</td>
                <td className="px-4 py-2.5">≤ 48 h hábiles</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">Pedidos urgentes (en producción)</td>
                <td className="px-4 py-2.5">Lun–Vie, 9–18 h</td>
                <td className="px-4 py-2.5">≤ 4 h hábiles</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Para consultas sobre un pedido en curso, siempre incluí el <strong>número de orden</strong>{" "}
          en el asunto para priorizar el ticket.
        </p>
      </>
    ),
  },
  {
    id: "formulario",
    titulo: "3. Formulario de Contacto",
    icono: Send,
    contenido: <ContactoFormulario />,
  },
];

const Contacto = () => {
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
            <Send size={13} />
            Contacto
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-[#e6d5cc] p-8 md:p-12 mb-8 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#B02F00] opacity-5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold text-[#B02F00] uppercase tracking-wider mb-2 block">
              Hablemos
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Contacto
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              ¿Tenés una consulta sobre un pedido, querés pedir un presupuesto a medida o simplemente
              consultar por un material? Escribinos y te respondemos a la brevedad.
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
                Secciones
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
                  <MapPin size={15} className="text-[#B02F00]" />
                  Taller y showrom
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Av. Corrientes 1234, Piso 3<br />
                  CABA, Buenos Aires, Argentina
                </p>
                <a
                  href="tel:+541155551234"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#B02F00] hover:underline"
                >
                  <Phone size={13} />
                  +54 11 5555-1234
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

          </div>

        </div>

      </div>
    </main>
  );
};

export default Contacto;
