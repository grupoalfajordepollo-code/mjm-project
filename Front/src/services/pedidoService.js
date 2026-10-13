import api from "./api";

export const obtenerPedidos = () => {
  return api.get("/pedidos");
};

export const obtenerPedido = (id) => {
  return api.get(`/pedidos/${id}`);
};

export const obtenerPedidosPorUsuario = (idUsuario) => {
  return api.get(`/pedidos/usuario/${idUsuario}`);
};

export const crearPedido = (data) => {
  return api.post("/pedidos", data);
};

export const actualizarPedido = (id, data) => {
  return api.put(`/pedidos/${id}`, data);
};

export const eliminarPedido = (id) => {
  return api.delete(`/pedidos/${id}`);
};
