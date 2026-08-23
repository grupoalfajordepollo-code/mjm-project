import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

const Unauthorized401 = () => {
  return (
    <main className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 font-space p-6">
      
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-[#e6d5cc] p-8 md:p-12 text-center relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#B02F00] opacity-5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#B02F00] opacity-5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative w-20 h-20 bg-[#fef5f2] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#f5e3dc]">
          <ShieldAlert className="h-10 w-10 text-[#B02F00]" strokeWidth={1.5} />
        </div>

        <h1 className="text-5xl font-black text-[#B02F00] mb-2 tracking-tight">401</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso No Autorizado</h2>
        
        <p className="text-gray-500 text-sm mb-10 leading-relaxed px-4">
          Parece que no tienes los permisos necesarios para ver esta página o tu sesión ha expirado. Por favor, inicia sesión para acceder al contenido.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          
          <button 
            type="button"
            className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3.5 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
          >
            <LogIn size={18} strokeWidth={2} />
            Iniciar Sesión
          </button>
          
          <button 
            type="button"
            className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-lg border-2 border-[#e6d5cc] transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={2} />
            Volver al Inicio
          </button>

        </div>
      </div>
      
    </main>
  );
};

export default Unauthorized401;