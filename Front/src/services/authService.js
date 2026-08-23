import api from "./api";

export const login = (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const loginAdmin = (email, password) => {
  return api.post("/auth/login-admin", { email, password });
};

export const register = ({ nombre, apellido, email, password, telefono }) => {
  return api.post("/usuarios", { nombre, apellido, email, password, telefono });
};
