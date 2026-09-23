import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Perfil() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const domicilioVacio = {
    calle: "",
    numero: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    referencia: "",
    favorito: false,
  };

  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  const [domicilios, setDomicilios] = useState([]);
  const [nuevoDomicilio, setNuevoDomicilio] = useState(domicilioVacio);
  const [domicilioEditando, setDomicilioEditando] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);

  const [mostrarFormularioDomicilio, setMostrarFormularioDomicilio] =
    useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [mensajeDomicilio, setMensajeDomicilio] = useState("");
  const [errorDomicilio, setErrorDomicilio] = useState("");

  // =====================================================
  // CARGAR DOMICILIOS DESDE LA BASE
  // =====================================================

  const cargarDomicilios = () => {
    if (!user?.id) {
      return Promise.resolve();
    }

    return api
      .get(`/domicilios/usuario/${user.id}`)
      .then((response) => {
        setDomicilios(response.data);
      })
      .catch((err) => {
        console.error("Error al obtener domicilios:", err);
        setErrorDomicilio("No se pudieron cargar los domicilios.");
      });
  };

  // =====================================================
  // CARGAR PERFIL
  // =====================================================

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    setUsuario({
      nombre: user.nombre || "",
      apellido: user.apellido || "",
      email: user.email || "",
      telefono: user.telefono || "",
    });

    api
      .get(`/domicilios/usuario/${user.id}`)
      .then((response) => {
        setDomicilios(response.data);
      })
      .catch((err) => {
        console.error("Error al obtener domicilios:", err);
        setErrorDomicilio("No se pudieron cargar los domicilios.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, [user, isAuthenticated, navigate]);

  // =====================================================
  // DATOS PERSONALES
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUsuario({
      ...usuario,
      [name]: value,
    });
  };

  const handleGuardar = (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    api
      .put(`/usuarios/${user.id}`, usuario)
      .then((response) => {
        const usuarioActualizado = {
          ...user,
          ...response.data,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(usuarioActualizado)
        );

        setUsuario({
          nombre: response.data.nombre || "",
          apellido: response.data.apellido || "",
          email: response.data.email || "",
          telefono: response.data.telefono || "",
        });

        setMensaje("Perfil actualizado correctamente.");
        setEditando(false);
      })
      .catch((err) => {
        console.error("Error al actualizar perfil:", err);

        setError(
          err.response?.data?.mensaje ||
            "No se pudo actualizar el perfil."
        );
      });
  };

  const cancelarEdicionPerfil = () => {
    setUsuario({
      nombre: user.nombre || "",
      apellido: user.apellido || "",
      email: user.email || "",
      telefono: user.telefono || "",
    });

    setEditando(false);
    setMensaje("");
    setError("");
  };

  // =====================================================
  // DOMICILIOS
  // =====================================================

  const handleDomicilioChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNuevoDomicilio({
      ...nuevoDomicilio,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const abrirNuevoDomicilio = () => {
    setNuevoDomicilio(domicilioVacio);
    setDomicilioEditando(null);

    setMensajeDomicilio("");
    setErrorDomicilio("");

    setMostrarFormularioDomicilio(true);
  };

  const handleEditarDomicilio = (domicilio) => {
    setDomicilioEditando(domicilio);

    setNuevoDomicilio({
      calle: domicilio.calle || "",
      numero: domicilio.numero || "",
      ciudad: domicilio.ciudad || "",
      provincia: domicilio.provincia || "",
      codigoPostal: domicilio.codigoPostal || "",
      referencia: domicilio.referencia || "",
      favorito: domicilio.favorito || false,
    });

    setMensajeDomicilio("");
    setErrorDomicilio("");

    setMostrarFormularioDomicilio(true);
  };

  const cancelarDomicilio = () => {
    setNuevoDomicilio(domicilioVacio);
    setDomicilioEditando(null);
    setMostrarFormularioDomicilio(false);

    setMensajeDomicilio("");
    setErrorDomicilio("");
  };

  const handleGuardarDomicilio = (e) => {
    e.preventDefault();

    setMensajeDomicilio("");
    setErrorDomicilio("");

    const datosDomicilio = {
      idUsuario: user.id,
      calle: nuevoDomicilio.calle,
      numero: nuevoDomicilio.numero,
      ciudad: nuevoDomicilio.ciudad,
      provincia: nuevoDomicilio.provincia,
      codigoPostal: nuevoDomicilio.codigoPostal,
      referencia: nuevoDomicilio.referencia,
      favorito: nuevoDomicilio.favorito,
    };

    // ===================================================
    // EDITAR DOMICILIO
    // ===================================================

    if (domicilioEditando) {
      api
        .put(
          `/domicilios/${domicilioEditando.id}`,
          datosDomicilio
        )
        .then(() => {
          return cargarDomicilios();
        })
        .then(() => {
          setNuevoDomicilio(domicilioVacio);
          setDomicilioEditando(null);
          setMostrarFormularioDomicilio(false);

          setMensajeDomicilio(
            "Domicilio actualizado correctamente."
          );
        })
        .catch((err) => {
          console.error(
            "Error al actualizar domicilio:",
            err
          );

          setErrorDomicilio(
            err.response?.data?.mensaje ||
              "No se pudo actualizar el domicilio."
          );
        });

      return;
    }

    // ===================================================
    // CREAR DOMICILIO
    // ===================================================

    api
      .post("/domicilios", datosDomicilio)
      .then(() => {
        return cargarDomicilios();
      })
      .then(() => {
        setNuevoDomicilio(domicilioVacio);
        setDomicilioEditando(null);
        setMostrarFormularioDomicilio(false);

        setMensajeDomicilio(
          "Domicilio agregado correctamente."
        );
      })
      .catch((err) => {
        console.error("Error al agregar domicilio:", err);

        setErrorDomicilio(
          err.response?.data?.mensaje ||
            "No se pudo agregar el domicilio."
        );
      });
  };

  // =====================================================
  // ELIMINAR DOMICILIO
  // =====================================================

  const handleEliminarDomicilio = (domicilio) => {
    const confirmar = window.confirm(
      `¿Seguro que querés eliminar el domicilio ${domicilio.calle} ${domicilio.numero}?`
    );

    if (!confirmar) {
      return;
    }

    setMensajeDomicilio("");
    setErrorDomicilio("");

    api
      .delete(`/domicilios/${domicilio.id}`)
      .then(() => {
        return cargarDomicilios();
      })
      .then(() => {
        setNuevoDomicilio(domicilioVacio);
        setDomicilioEditando(null);
        setMostrarFormularioDomicilio(false);

        setMensajeDomicilio(
          "Domicilio eliminado correctamente."
        );
      })
      .catch((err) => {
        console.error("Error al eliminar domicilio:", err);

        setErrorDomicilio(
          err.response?.data?.mensaje ||
            "No se pudo eliminar el domicilio."
        );
      });
  };

  // =====================================================
  // CARGANDO
  // =====================================================

  if (cargando) {
    return (
      <main className="min-h-[60vh] bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-[#64748B]">
          Cargando perfil...
        </p>
      </main>
    );
  }

  return (
    <main className="bg-[#F8F9FA] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* TÍTULO */}

        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#B02F00] uppercase mb-2">
            Mi cuenta
          </p>

          <h1 className="text-4xl font-bold text-[#0F172A]">
            Mi Perfil
          </h1>

          <p className="text-[#64748B] mt-2">
            Consultá y administrá la información de tu cuenta.
          </p>
        </div>

        {/* ================================================= */}
        {/* DATOS PERSONALES */}
        {/* ================================================= */}

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">

          <div className="px-8 py-7 border-b border-gray-200 flex items-center gap-5">

            <div className="w-16 h-16 rounded-full bg-[#B02F00] text-white flex items-center justify-center text-2xl font-bold">
              {usuario.nombre
                ? usuario.nombre.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {usuario.nombre} {usuario.apellido}
              </h2>

              <p className="text-[#64748B] text-sm">
                {usuario.email}
              </p>
            </div>

          </div>

          <form onSubmit={handleGuardar} className="p-8">

            {mensaje && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
                {mensaje}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Nombre
                </label>

                <input
                  type="text"
                  name="nombre"
                  value={usuario.nombre}
                  onChange={handleChange}
                  disabled={!editando}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#B02F00] disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Apellido
                </label>

                <input
                  type="text"
                  name="apellido"
                  value={usuario.apellido}
                  onChange={handleChange}
                  disabled={!editando}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#B02F00] disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={usuario.email}
                  onChange={handleChange}
                  disabled={!editando}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#B02F00] disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Teléfono
                </label>

                <input
                  type="text"
                  name="telefono"
                  value={usuario.telefono}
                  onChange={handleChange}
                  disabled={!editando}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#B02F00] disabled:bg-gray-100"
                />
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">

              {!editando ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditando(true);
                    setMensaje("");
                    setError("");
                  }}
                  className="bg-[#B02F00] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
                >
                  Editar Perfil
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={cancelarEdicionPerfil}
                    className="border border-gray-300 text-[#0F172A] px-6 py-3 rounded-lg font-semibold"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="bg-[#B02F00] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
                  >
                    Guardar Cambios
                  </button>
                </>
              )}

            </div>

          </form>

        </section>

        {/* ================================================= */}
        {/* DOMICILIOS */}
        {/* ================================================= */}

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                Mis domicilios
              </h2>

              <p className="text-sm text-[#64748B] mt-1">
                Direcciones disponibles para tus compras y entregas.
              </p>
            </div>

            {!mostrarFormularioDomicilio && (
              <button
                type="button"
                onClick={abrirNuevoDomicilio}
                className="bg-[#B02F00] text-white px-5 py-3 rounded-lg font-semibold hover:opacity-90"
              >
                Agregar domicilio
              </button>
            )}

          </div>

          <div className="p-8">

            {mensajeDomicilio && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
                {mensajeDomicilio}
              </div>
            )}

            {errorDomicilio && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                {errorDomicilio}
              </div>
            )}

            {/* FORMULARIO DOMICILIO */}

            {mostrarFormularioDomicilio && (
              <form
                onSubmit={handleGuardarDomicilio}
                className="mb-8 border border-gray-200 rounded-xl p-6"
              >

                <h3 className="text-lg font-bold text-[#0F172A] mb-6">
                  {domicilioEditando
                    ? "Editar domicilio"
                    : "Nuevo domicilio"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                      Calle
                    </label>

                    <input
                      type="text"
                      name="calle"
                      value={nuevoDomicilio.calle}
                      onChange={handleDomicilioChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#B02F00]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                      Número
                    </label>

                    <input
                      type="text"
                      name="numero"
                      value={nuevoDomicilio.numero}
                      onChange={handleDomicilioChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#B02F00]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                      Ciudad
                    </label>

                    <input
                      type="text"
                      name="ciudad"
                      value={nuevoDomicilio.ciudad}
                      onChange={handleDomicilioChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#B02F00]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                      Provincia
                    </label>

                    <input
                      type="text"
                      name="provincia"
                      value={nuevoDomicilio.provincia}
                      onChange={handleDomicilioChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#B02F00]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                      Código Postal
                    </label>

                    <input
                      type="text"
                      name="codigoPostal"
                      value={nuevoDomicilio.codigoPostal}
                      onChange={handleDomicilioChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#B02F00]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                      Referencia
                    </label>

                    <input
                      type="text"
                      name="referencia"
                      value={nuevoDomicilio.referencia}
                      onChange={handleDomicilioChange}
                      placeholder="Opcional"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#B02F00]"
                    />
                  </div>

                </div>

                <div className="mt-6">

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      name="favorito"
                      checked={nuevoDomicilio.favorito}
                      onChange={handleDomicilioChange}
                      className="w-4 h-4"
                    />

                    <span className="text-sm font-semibold text-[#0F172A]">
                      Marcar como domicilio favorito
                    </span>

                  </label>

                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={cancelarDomicilio}
                    className="border border-gray-300 text-[#0F172A] px-6 py-3 rounded-lg font-semibold"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="bg-[#B02F00] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
                  >
                    {domicilioEditando
                      ? "Guardar cambios"
                      : "Guardar domicilio"}
                  </button>

                </div>

              </form>
            )}

            {/* LISTADO DE DOMICILIOS */}

            {domicilios.length === 0 ? (
              !mostrarFormularioDomicilio && (
                <div className="text-center py-8">

                  <h3 className="font-semibold text-[#0F172A]">
                    Todavía no tenés domicilios cargados
                  </h3>

                  <p className="text-[#64748B] text-sm mt-2">
                    Agregá una dirección para utilizarla en tus compras.
                  </p>

                </div>
              )
            ) : (
              <div className="space-y-4">

                {domicilios.map((domicilio) => (
                  <div
                    key={domicilio.id}
                    className="border border-gray-200 rounded-xl p-6"
                  >

                    <div className="flex justify-between gap-6">

                      <div>

                        <div className="flex items-center gap-3 mb-3">

                          <h3 className="text-lg font-bold text-[#0F172A]">
                            {domicilio.calle} {domicilio.numero}
                          </h3>

                          {domicilio.favorito && (
                            <span className="text-xs font-bold bg-orange-50 text-[#B02F00] px-3 py-1 rounded-full">
                              Favorito
                            </span>
                          )}

                        </div>

                        <p className="text-[#64748B]">
                          {domicilio.ciudad}, {domicilio.provincia}
                        </p>

                        <p className="text-[#64748B]">
                          Código Postal: {domicilio.codigoPostal}
                        </p>

                        {domicilio.referencia && (
                          <p className="text-[#64748B] mt-2">
                            Referencia: {domicilio.referencia}
                          </p>
                        )}

                      </div>

                      <div className="flex items-start gap-4">

                        <button
                          type="button"
                          onClick={() =>
                            handleEditarDomicilio(domicilio)
                          }
                          className="text-[#B02F00] font-semibold hover:underline"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEliminarDomicilio(domicilio)
                          }
                          className="text-red-600 font-semibold hover:underline"
                        >
                          Eliminar
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

export default Perfil;

