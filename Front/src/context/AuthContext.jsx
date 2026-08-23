import { createContext, useContext, useState, useEffect } from "react";
import {
  login as loginService,
  loginAdmin as loginAdminService,
  register as registerService,
} from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [rol, setRol] = useState(() => localStorage.getItem("rol"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (rol) {
      localStorage.setItem("rol", rol);
    } else {
      localStorage.removeItem("rol");
    }
  }, [rol]);

  const login = async (email, password, tipo = "cliente") => {
    setLoading(true);
    setError(null);
    try {
      const response =
        tipo === "admin"
          ? await loginAdminService(email, password)
          : await loginService(email, password);

      const data = response.data;
      setToken(data.token);
      setUser(data.usuario || data.admin);
      setRol(tipo === "admin" ? "admin" : "usuario");
      return data;
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje || "Error al iniciar sesion";
      setError(mensaje);
      throw new Error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ nombre, apellido, email, password, telefono }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerService({
        nombre,
        apellido,
        email,
        password,
        telefono,
      });
      return response.data;
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje || "Error al registrar usuario";
      setError(mensaje);
      throw new Error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRol(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        rol,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
