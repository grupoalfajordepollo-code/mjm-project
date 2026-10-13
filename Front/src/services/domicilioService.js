import api from "./api";

export const obtenerDomicilios = () => {
  return api.get("/domicilios");
};

export const obtenerDomicilio = (id) => {
  return api.get(`/domicilios/${id}`);
};

export const obtenerDomiciliosPorUsuario = (idUsuario) => {
  return api.get(`/domicilios/usuario/${idUsuario}`);
};

export const crearDomicilio = (data) => {
  return api.post("/domicilios", data);
};

export const actualizarDomicilio = (id, data) => {
  return api.put(`/domicilios/${id}`, data);
};

export const eliminarDomicilio = (id) => {
  return api.delete(`/domicilios/${id}`);
};
