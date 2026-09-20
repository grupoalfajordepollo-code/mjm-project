import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [intentos, setIntentos] = useState(0);
  const [bloqueoHasta, setBloqueoHasta] = useState(0);
  const [ahora, setAhora] = useState(() => Date.now());
  const { login, logout, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const bloqueado = ahora < bloqueoHasta;
  const restantes = Math.max(0, Math.ceil((bloqueoHasta - ahora) / 1000));

  useEffect(() => {
    if (!bloqueado) return;
    const t = setInterval(() => setAhora(Date.now()), 500);
    return () => clearInterval(t);
  }, [bloqueado]);

  // Bloqueo lógico progresivo: 2s, 4s, 8s… tope 30s. Si el servidor impone
  // su propio bloqueo (429 + Retry-After), manda el servidor.
  const registrarFallo = (segundosServidor = 0) => {
    const n = intentos + 1;
    setIntentos(n);
    const espera = segundosServidor > 0 ? segundosServidor : Math.min(2 ** n, 30);
    setBloqueoHasta(Date.now() + espera * 1000);
    setAhora(Date.now());
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bloqueado || loading) return;
    setError(null);
    try {
      const data = await login(email, password);
      if (data.rol === "admin") {
        setIntentos(0);
        setBloqueoHasta(0);
        navigate("/panel-secured");
      } else {
        logout(); // no dejar sesión colgada con rol incorrecto
        registrarFallo();
        setError("Esta cuenta no tiene permisos de administrador");
      }
    } catch (err) {
      const resp = err.response ?? err.cause?.response;
      const retryAfter = Number(resp?.headers?.["retry-after"]);
      registrarFallo(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 0);
      // el mensaje lo setea el context (mensaje del back o genérico)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827] p-4 font-space">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
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
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#e6d5cc] rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#e6d5cc] rounded-lg text-gray-900 placeholder-gray-400 text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || bloqueado}
                className="cursor-pointer w-full flex items-center justify-center gap-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Ingresando..." : bloqueado ? `Reintentá en ${restantes}s` : "Acceder al Panel"}
                {!loading && !bloqueado && <ArrowRight className="h-4 w-4" />}
              </button>

              {intentos >= 2 && !bloqueado && (
                <p className="text-center text-xs text-gray-500">
                  Llevás {intentos} intentos fallidos seguidos.
                </p>
              )}
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
