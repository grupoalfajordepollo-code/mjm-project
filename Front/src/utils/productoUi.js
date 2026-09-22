// Helpers visuales de producto compartidos por las vistas de catálogo.
// (ProductDetail usa su propio badge con otra paleta: no se toca.)

// Badge de disponibilidad según stock
export const getBadge = (stock) => {
  if (stock === 0) return { text: 'Agotado', style: 'bg-white text-gray-600 shadow-sm' };
  if (stock <= 10) return { text: '¡Últimas unidades!', style: 'bg-[#fef0cd] text-[#9a6a00]' };
  return { text: 'Disponible', style: 'bg-[#d1f4e0] text-[#1e7b45]' };
};

// Precio en formato es-AR sin decimales (convención del catálogo)
export const formatPrecio = (v) => Number(v || 0).toLocaleString('es-AR');
