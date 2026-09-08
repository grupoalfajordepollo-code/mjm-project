import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(email, password);
      if (data.rol === "admin") {
        navigate("/panel-secured");
      } else {
        setError("Esta cuenta no tiene permisos de administrador");
      }
    } catch {
      // el error ya se setea en el context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827] p-4 font-space">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-[#1f2937] px-8 py-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#374151] rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">MJM 3D</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Panel de Administración</h1>
            <p className="text-gray-400 text-sm">Acceso exclusivo para administradores</p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@mjm3d.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full flex items-center justify-center gap-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Ingresando..." : "Acceder al Panel"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          © 2024 MJM 3D — Administración
        </p>
      </div>
    </div>
  );
};

export default AdminLoginForm;
