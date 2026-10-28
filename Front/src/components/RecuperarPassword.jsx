import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const RecuperarPassword = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const solicitarRecuperacion = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setCargando(true);

    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/auth/recuperar-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al solicitar recuperación");
      }

      setMensaje(datos.mensaje);

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
          Recuperar contraseña
        </h1>

        <p className="text-gray-500 text-sm text-center mb-6">
          Ingresá tu correo electrónico y te enviaremos
          un enlace para restablecer tu contraseña.
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

        <form onSubmit={solicitarRecuperacion}>
          <div className="relative mb-5">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-[#e6d5cc] rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#B02F00] text-white font-bold py-3 rounded-lg cursor-pointer disabled:opacity-50"
          >
            {cargando ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link to="/login" className="text-[#B02F00] font-bold">
            Volver al inicio de sesión
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RecuperarPassword;

