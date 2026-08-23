import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-space">

            <div className="flex w-full max-w-250 bg-white rounded-2xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.1)] border border-[#e6d5cc] overflow-hidden">
                <div className="hidden md:flex flex-col justify-end w-1/2 bg-[#1a1c1e] relative">
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                    <div className="relative z-20 p-10 text-white">
                        <h2 className="text-3xl font-bold mb-3">Eleva tu Creatividad 3D</h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Únete a la comunidad líder de manufactura aditiva y diseño técnico.
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
                        <p className="text-[#5B4039] text-sm">
                            Completa los datos para comenzar tu experiencia en MJM 3D.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-[#5B4039] mb-1.5">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Juan"
                                    className="w-full px-4 py-2.5 bg-white border border-[#e6d5cc] rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5a2c] focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-[#5B4039] mb-1.5">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Pérez"
                                    className="w-full px-4 py-2.5 bg-white border border-[#e6d5cc] rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5a2c] focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#5B4039] mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="w-full px-4 py-2.5 bg-white border border-[#e6d5cc] rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5a2c] focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#5B4039] mb-1.5">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-4 pr-12 py-2.5 bg-white border border-[#e6d5cc] rounded-lg text-gray-900 placeholder-gray-400 tracking-widest focus:outline-none focus:ring-2 focus:ring-[#ff5a2c] focus:border-transparent transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B4039] hover:text-[#ff5a2c] cursor-pointer transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                                </button>
                            </div>
                        </div>


                        <div>
                            <label className="block text-xs font-bold text-[#5B4039] mb-1.5">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-4 pr-12 py-2.5 bg-white border border-[#e6d5cc] rounded-lg text-gray-900 placeholder-gray-400 tracking-widest focus:outline-none focus:ring-2 focus:ring-[#ff5a2c] focus:border-transparent transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a4228] hover:text-[#ff5a2c] cursor-pointer transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 rounded border-gray-300 text-[#ff5a2c] focus:ring-[#ff5a2c] cursor-pointer"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
                                Acepto los <span className="font-bold text-[#B02F00] hover:underline">Términos y Condiciones</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="cursor-pointer w-full bg-[#ff5a2c] hover:bg-[#e04a1f] text-white font-bold py-3.5 px-4 rounded-lg transition-colors mt-4"
                        >
                            Crear Cuenta
                        </button>

                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        ¿Ya tienes una cuenta?{' '}
                        <a href="#" className="font-bold text-[#B02F00] hover:underline">
                            Inicia Sesión
                        </a>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default RegisterForm;