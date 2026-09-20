import { useState, useEffect } from 'react';
import { Search, ShoppingCart, CircleUserRound } from 'lucide-react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { obtenerProductos } from "../services/productoService";
import { getAsset } from "../utils/getAssetsUrl";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // En pantallas de autenticación el buscador de productos no tiene sentido
  const esAuth = location.pathname === "/login" || location.pathname === "/registro";
  // Fuente única de verdad: ?q= en la URL (el catálogo filtra desde ahí,
  // el link es compartible y el botón atrás funciona)
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  // Autocomplete: catálogo de productos para matchear en vivo
  const [productos, setProductos] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(-1);

  useEffect(() => {
    obtenerProductos()
      .then((r) => setProductos(r.data ?? []))
      .catch(() => {});
  }, []);

  const coincidencias = q.trim() === ""
    ? []
    : productos.filter((p) =>
        (p.nombre || "").toLowerCase().includes(q.trim().toLowerCase()) ||
        (p.descripcion || "").toLowerCase().includes(q.trim().toLowerCase())
      );
  const sugerencias = coincidencias.slice(0, 6);

  const irAlCatalogo = () => {
    setAbierto(false);
    setActivo(-1);
    if (location.pathname !== "/") {
      navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
    }
    // espera al render del home si venimos de otra ruta
    setTimeout(() => {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    }, location.pathname !== "/" ? 350 : 0);
  };

  const elegir = (prod) => {
    if (location.pathname !== "/") {
      navigate(`/?q=${encodeURIComponent(prod.nombre)}`);
    } else {
      setSearchParams({ q: prod.nombre });
    }
    setAbierto(false);
    setActivo(-1);
    setTimeout(() => {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    }, location.pathname !== "/" ? 350 : 0);
  };

  const buscar = (valor) => {
    setActivo(-1);
    setAbierto(true);
    if (location.pathname !== "/") {
      // replace para no ensuciar el historial con cada tecla
      navigate(valor ? `/?q=${encodeURIComponent(valor)}` : "/", { replace: true });
    } else if (valor) {
      setSearchParams({ q: valor });
    } else {
      setSearchParams({});
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 font-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        <div className="flex items-center gap-8">

          <Link to="/" className="text-2xl font-black tracking-wide text-[#B02F00]">
            MJM 3D
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-[#B02F00] font-bold text-sm border-b-2 border-[#B02F00] pb-1"
            >
              Home
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          { !esAuth && (
          <div
            className="relative w-48 sm:w-64 md:w-80"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setAbierto(false);
                setActivo(-1);
              }
            }}
          >
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Search className="h-4 w-4 stroke-2" />
            </div>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={q}
              role="combobox"
              aria-expanded={abierto && q.trim() !== ""}
              aria-controls="buscador-sugerencias"
              aria-activedescendant={activo >= 0 ? `sugerencia-${activo}` : undefined}
              autoComplete="off"
              onFocus={() => { if (q.trim() !== "") setAbierto(true); }}
              onChange={(e) => buscar(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" && sugerencias.length > 0) {
                  e.preventDefault();
                  setAbierto(true);
                  setActivo((a) => (a + 1) % sugerencias.length);
                } else if (e.key === "ArrowUp" && sugerencias.length > 0) {
                  e.preventDefault();
                  setActivo((a) => (a - 1 + sugerencias.length) % sugerencias.length);
                } else if (e.key === "Enter") {
                  if (activo >= 0 && sugerencias[activo]) elegir(sugerencias[activo]);
                  else irAlCatalogo();
                } else if (e.key === "Escape") {
                  setAbierto(false);
                  setActivo(-1);
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-[#f0f3f6] border border-[#f0ded6] rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B02F00]/20 focus:border-[#B02F00] transition-all"
            />
            {abierto && q.trim() !== "" && (
              <div
                id="buscador-sugerencias"
                role="listbox"
                className="absolute top-full left-0 right-0 sm:right-auto sm:w-80 mt-2 bg-white border border-[#e6d5cc] rounded-xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.25)] overflow-hidden z-50"
              >
                {sugerencias.length > 0 ? (
                  <>
                    {sugerencias.map((prod, i) => {
                      const agotado = Number(prod.stock) === 0;
                      return (
                        <button
                          key={prod.id}
                          id={`sugerencia-${i}`}
                          role="option"
                          aria-selected={i === activo}
                          type="button"
                          onClick={() => elegir(prod)}
                          onMouseEnter={() => setActivo(i)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${i === activo ? 'bg-[#fff5f2]' : 'bg-white'}`}
                        >
                          {prod.imagenes?.[0]?.imagen ? (
                            <img
                              src={getAsset(prod.imagenes[0].imagen)}
                              alt=""
                              className="w-9 h-9 rounded-lg object-cover border border-[#e6d5cc] bg-[#FFF1EA] shrink-0"
                              loading="lazy"
                            />
                          ) : (
                            <span className="w-9 h-9 rounded-lg bg-[#FFF1EA] border border-[#ffdbcc] text-[#B02F00] flex items-center justify-center text-[11px] font-extrabold shrink-0">
                              {(prod.nombre || "?").trim().charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold text-gray-900">{prod.nombre}</span>
                            <span className="block truncate text-[11px] text-gray-500">
                              {prod.categoria?.nombre || "General"}
                              {" · "}
                              {agotado ? (
                                <span className="font-bold text-red-600">Agotado</span>
                              ) : (
                                <span className="font-bold text-gray-900 tabular-nums">
                                  ${Number(prod.precio).toLocaleString('es-AR')}
                                </span>
                              )}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={irAlCatalogo}
                      className="cursor-pointer w-full px-3 py-2 text-xs font-bold text-[#B02F00] hover:bg-[#fff5f2] border-t border-[#e6d5cc] transition-colors text-center"
                    >
                      Ver los {coincidencias.length} resultados
                    </button>
                  </>
                ) : (
                  <p className="px-4 py-3 text-xs text-gray-500 text-center">
                    Sin coincidencias para “{q.trim()}”.
                  </p>
                )}
              </div>
            )}
          </div>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-sm text-gray-700">
                Hola, <strong>{user.nombre}</strong>
              </span>
              <button 
                onClick={handleLogout}
                className="text-sm font-bold text-[#B02F00] hover:opacity-80 transition-opacity whitespace-nowrap cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-bold text-[#B02F00] hover:opacity-80 transition-opacity whitespace-nowrap">
              Iniciar Sesion / Registrarse
            </Link>
          )}

          <div className="flex items-center gap-3 text-gray-700">
            <button 
              type="button" 
              className="p-1.5 hover:text-[#B02F00] cursor-pointer transition-colors rounded-full hover:bg-gray-100"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <Link 
              to={user ? "/perfil" : "/login"}
              className="p-1.5 hover:text-[#B02F00] cursor-pointer transition-colors rounded-full hover:bg-gray-100"
              aria-label="Cuenta de usuario"
            >
              <CircleUserRound className="h-5 w-5" strokeWidth={1.8} />
            </Link>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;