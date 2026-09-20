import api from "./api";

export const obtenerPedidos = () => {
  return api.get("/pedidos");
};

export const actualizarPedido = (id, data) => {
  return api.put(`/pedidos/${id}`, data);
};
