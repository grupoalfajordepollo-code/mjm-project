import { Search, ShoppingCart, CircleUserRound } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-white border-b border-gray-100 font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        <div className="flex items-center gap-8">

          <a href="#" className="text-2xl font-black tracking-wide text-[#B02F00]">
            MJM 3D
          </a>

          <nav className="hidden sm:flex items-center gap-6">
            <a 
              href="#" 
              className="text-[#B02F00] font-bold text-sm border-b-2 border-[#B02F00] pb-1"
            >
              Home
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative w-48 sm:w-64 md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Search className="h-4 w-4 stroke-2" />
            </div>
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 bg-[#f0f3f6] border border-[#f0ded6] rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all"
            />
          </div>

          <a 
            href="#" 
            className="hidden md:inline-block text-sm font-bold text-[#B02F00] hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            Ingresar / Registrarse
          </a>

          <div className="flex items-center gap-3 text-gray-700">
            <button 
              type="button" 
              className="p-1.5 hover:text-[#B02F00] cursor-pointer transition-colors rounded-full hover:bg-gray-100"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <button 
              type="button" 
              className="p-1.5 hover:text-[#B02F00] cursor-pointer transition-colors rounded-full hover:bg-gray-100"
              aria-label="Cuenta de usuario"
            >
              <CircleUserRound className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;