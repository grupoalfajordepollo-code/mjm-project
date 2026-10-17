import { Share2, Globe } from 'lucide-react';
import {Link} from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#f8f9fb] font-space border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          <div className="md:col-span-4 lg:col-span-5">
            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-wide">MJM 3D</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Líderes en fabricación aditiva y diseño técnico.<br />
              Transformamos ideas digitales en realidades físicas de alta precisión.
            </p>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="text-[11px] font-bold text-[#B02F00] uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-3">
              <li><Link to={`/catalogo?cat=${encodeURIComponent('Impresión 3D')}`} className="text-sm text-gray-500 hover:text-[#B02F00] transition-colors">Impresión 3D</Link></li>
              <li><Link to={`/catalogo?cat=${encodeURIComponent('Filamento')}`} className="text-sm text-gray-500 hover:text-[#B02F00] transition-colors">Filamento</Link></li>
              <li><Link to={`/catalogo?cat=${encodeURIComponent('Repuestos')}`} className="text-sm text-gray-500 hover:text-[#B02F00] transition-colors">Repuestos</Link></li>
              <li><Link to={`/catalogo?cat=${encodeURIComponent('Accesorios')}`} className="text-sm text-gray-500 hover:text-[#B02F00] transition-colors">
                Accesorios</Link></li>
              <li>
                <Link to={`/catalogo?cat=${encodeURIComponent('Juguetes')}`} className="text-sm text-gray-500 hover:text-[#B02F00] transition-colors">Juguetes</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="text-[11px] font-bold text-[#B02F00] uppercase tracking-wider mb-4">
              Empresa
            </h4>
            <ul className="space-y-3">
              <li><Link to="/soporte" className="text-sm text-gray-500 hover:text-[#B02F00] transition-colors">Soporte</Link></li>
              <li><Link to="/terminos" className="text-sm text-gray-500 hover:text-[#B02F00] transition-colors">Términos</Link></li>
              <li><Link to="/privacidad" className="text-sm text-gray-500 hover:text-[#B02F00] transition-colors">Privacidad</Link></li>
              <li><Link to="/contacto" className="text-sm text-gray-500 hover:text-[#B02F00] transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-4">
              Suscribite
            </h4>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Tu email"
                className="w-full px-3 py-2 bg-transparent border border-[#e6d5cc] rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all"
                required
              />
              <button
                type="submit"
                className="cursor-pointer px-5 py-2 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-md transition-colors"
              >
                OK
              </button>
            </form>
          </div>

        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 MJM 3D Marketplace. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-5 text-gray-500">
            <button 
              className="hover:text-[#B02F00] cursor-pointer transition-colors" 
              aria-label="Compartir"
            >
              <Share2 className="h-4.5 w-4.5" strokeWidth={1.8} />
            </button>
            <button 
              className="hover:text-[#B02F00] cursor-pointer transition-colors" 
              aria-label="Idioma"
            >
              <Globe className="h-4.5 w-4.5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;