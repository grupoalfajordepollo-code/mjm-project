
const BotonWhatsApp = () => {
  const telefono = "5493874205998";

  const mensaje = encodeURIComponent(
    "Hola, quisiera consultar sobre los productos de MJM 3D."
  );

  return (
    <a
      href={`https://wa.me/${telefono}?text=${mensaje}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#1DA851] hover:shadow-xl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M16 .8A15.1 15.1 0 0 0 3 23.5L.8 31.2l7.9-2.1A15.2 15.2 0 1 0 16 .8Zm0 27.5a12.2 12.2 0 0 1-6.2-1.7l-.5-.3-4.6 1.2 1.2-4.5-.3-.5A12.3 12.3 0 1 1 16 28.3Zm6.8-9.2c-.4-.2-2.2-1.1-2.6-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.2 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7.4-.6c.1-.2 0-.5 0-.7l-1.2-2.8c-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5s-1.3 1.3-1.3 3.1 1.3 3.1 1.3 3.3 3.5 5.1c2.2 1.9 4.4 2.5 5.9 2.7 1.5.2 2.9.2 4-.3 1.2-.5 2.2-1.9 2.5-2.7.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.7-.5Z"/>
      </svg>

      <span className="font-semibold">
        Consultanos
      </span>
    </a>
  );
};

export default BotonWhatsApp;

