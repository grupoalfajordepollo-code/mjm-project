import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-space">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Página no encontrada</p>
        <p className="text-sm text-gray-500 mb-8">
          La ruta que buscás no existe o fue movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#ba3b0a] hover:bg-[#9a2f07] text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          <Home size={18} />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound404;
