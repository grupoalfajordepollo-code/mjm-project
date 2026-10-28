
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const RestablecerPassword = () => {
  const [parametros] = useSearchParams();
  const token = parametros.get("token");

  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const restablecer = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/auth/restablecer-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token, password })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo cambiar la contraseña");
      }

      setMensaje(datos.mensaje);
      setPassword("");
      setConfirmarPassword("");

    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-space">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-[#e6d5cc]">

        <h1 className="text-2xl font-bold text-center mb-3">
          Restablecer contraseña
        </h1>

        {!token ? (
          <p className="text-red-600 text-center">
            El enlace de recuperación no es válido.
          </p>
        ) : (
          <>
            <p className="text-gray-500 text-sm text-center mb-6">
              Ingresá tu nueva contraseña.
            </p>

            {mensaje && (
              <p className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
                {mensaje}
              </p>
            )}

            {error && (
              <p className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </p>
            )}

            {!mensaje && (
              <form onSubmit={restablecer} className="space-y-4">
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-[#e6d5cc] rounded-lg"
                />

                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-[#e6d5cc] rounded-lg"
                />

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-[#B02F00] text-white font-bold py-3 rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {cargando ? "Guardando..." : "Cambiar contraseña"}
                </button>
              </form>
            )}
          </>
        )}

        <p className="text-center mt-6">
          <Link to="/login" className="text-[#B02F00] font-bold">
            Volver al inicio de sesión
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RestablecerPassword;

