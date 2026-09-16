/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  login as loginService,
  register as registerService,
} from "../services/authService";

import { isTokenExpired } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("token");
    if(saved && isTokenExpired(saved)){
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("rol");
      return null
    }
    return saved

  });
  const [user, setUser] = useState(() => {
    if(!token) return null;
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });


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

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(email, password);
      const data = response.data;
      setToken(data.token);
      setUser(data.usuario);
      setRol(data.rol);
      return data;
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje || "Error al iniciar sesion";
      setError(mensaje);
      throw new Error(mensaje, { cause: err });
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
      throw new Error(mensaje, { cause: err });
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

  const isAuthenticated = !!token && !isTokenExpired(token);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        setUser(null);
        setToken(null);
        setRol(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [token]);

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
