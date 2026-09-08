import api from "./api";

export const obtenerProductos = () => {
  return api.get("/productos");
};

export const obtenerProducto = (id) => {
  return api.get(`/productos/${id}`);
};

export const crearProducto = (data) => {
  return api.post("/productos", data);
};

export const actualizarProducto = (id, data) => {
  return api.put(`/productos/${id}`, data);
};

export const eliminarProducto = (id) => {
  return api.delete(`/productos/${id}`);
};

export const obtenerCategorias = () => {
  return api.get("/categorias");
};
