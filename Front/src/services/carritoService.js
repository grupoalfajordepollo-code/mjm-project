import api from "./api";

// Obtener carritos
export const obtenerCarritos = () => {
  return api.get("/carritos");
};

// Obtener carrito por ID
export const obtenerCarritoPorId = (id) => {
  return api.get(`/carritos/${id}`);
};

// Crear carrito
export const crearCarrito = (datos) => {
  return api.post("/carritos", datos);
};

// Actualizar carrito
export const actualizarCarrito = (id, datos) => {
  return api.put(`/carritos/${id}`, datos);
};

// Eliminar carrito
export const eliminarCarrito = (id) => {
  return api.delete(`/carritos/${id}`);
};

// Items del carrito
export const obtenerItemsCarrito = () => {
  return api.get("/items-carrito");
};

export const agregarItemCarrito = (item) => {
  return api.post("/items-carrito", item);
};

export const actualizarItemCarrito = (id, datos) => {
  return api.put(`/items-carrito/${id}`, datos);
};

export const eliminarItemCarrito = (id) => {
  return api.delete(`/items-carrito/${id}`);
};
