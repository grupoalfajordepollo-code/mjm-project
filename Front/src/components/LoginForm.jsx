import  { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';

const LoginForm = () => {
  const [role, setRole] = useState('cliente');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-space">
      <div className="w-full max-w-100 bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-orange-300">
        
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Bienvenido</h1>
          <p className="text-gray-500 text-sm">Inicia sesión para acceder a tu panel.</p>
        </div>

    
        <div className="flex p-1 mb-8 bg-[#f2f2f2] rounded-lg border border-orange-300">
          <button
            onClick={() => setRole('cliente')}
            className={`cursor-pointer flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              role === 'cliente'
                ? 'bg-[#ba3b0a] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Soy Cliente
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`cursor-pointer flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
              role === 'admin'
                ? 'bg-[#ba3b0a] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Soy Administrador
          </button>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-bold text-[#8a4228] mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
              </div>
              <input
                type="email"
                placeholder="ejemplo@mjm3d.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ba3b0a] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-bold text-gray-700">
                Contraseña
              </label>
              <a href="#" className="text-sm font-bold text-[#ba3b0a] hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 tracking-widest focus:outline-none focus:ring-2 focus:ring-[#ba3b0a] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full flex items-center justify-center gap-2 bg-[#ba3b0a] hover:bg-[#9a2f07] text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2"
          >
            Iniciar Sesión
            <LogIn className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </form>

        <div className="mt-8 mb-6 border-t border-gray-200"></div>

        <p className="text-center text-sm text-gray-600">
          ¿No tenés cuenta?{' '}
          <a href="#" className="font-bold text-[#ba3b0a] hover:underline">
            Registrate
          </a>
        </p>

      </div>
    </div>
  );
};

export default LoginForm;