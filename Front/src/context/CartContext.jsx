/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const STORAGE_KEY = "mjm_cart";

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

// Generador de tags/especificaciones visuales acorde al prototipo
const generarTagsParaProducto = (producto) => {
  if (Array.isArray(producto.tags) && producto.tags.length > 0) {
    return producto.tags;
  }
  
  const tags = [];
  const nombre = (producto.nombre || "").toLowerCase();
  const desc = (producto.descripcion || "").toLowerCase();

  // Tags basados en el tipo de producto
  if (nombre.includes("logo") || nombre.includes("branding") || desc.includes("vector")) {
    tags.push({ label: "STL", tipo: "mesh" });
    tags.push({ label: "120mm", tipo: "dimension" });
  } else if (nombre.includes("dragón") || nombre.includes("dragon") || desc.includes("articulado")) {
    tags.push({ label: "Soporte No Req.", tipo: "feature" });
  } else if (nombre.includes("engranaje") || desc.includes("reforzado") || desc.includes("petg")) {
    tags.push({ label: "PETG-CF", tipo: "material" });
  } else {
    // Fallback inteligente para piezas 3D estándar
    tags.push({ label: "STL", tipo: "mesh" });
    if (producto.categoria?.nombre) {
      tags.push({ label: producto.categoria.nombre, tipo: "category" });
    }
  }

  return tags;
};

const cargarCarritoGuardado = (userId) => {
  try {
    const userKey = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    const guardadoUsuario = localStorage.getItem(userKey);
    if (guardadoUsuario) {
      return JSON.parse(guardadoUsuario);
    }
    const guardadoGeneral = localStorage.getItem(STORAGE_KEY);
    if (guardadoGeneral) {
      return JSON.parse(guardadoGeneral);
    }
    return [];
  } catch (e) {
    console.error("Error al cargar carrito desde localStorage:", e);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const userId = user?.id;

  // Inicialización desde localStorage solo si el cliente está autenticado
  const [cart, setCart] = useState(() => {
    if (!isAuthenticated) return [];
    return cargarCarritoGuardado(userId);
  });

  const [prevAuth, setPrevAuth] = useState({ isAuthenticated, userId });

  // Sincronizar el carrito cuando cambia el estado de autenticación o el usuario
  if (prevAuth.isAuthenticated !== isAuthenticated || prevAuth.userId !== userId) {
    setPrevAuth({ isAuthenticated, userId });
    setCart(isAuthenticated ? cargarCarritoGuardado(userId) : []);
  }

  // Persistir carrito en localStorage únicamente cuando el cliente está autenticado
  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      const userKey = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
      localStorage.setItem(userKey, JSON.stringify(cart));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Error al persistir carrito:", e);
    }
  }, [cart, isAuthenticated, userId]);

  // Redirigir a login si no está autenticado
  const validarAutenticacion = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const crearCarrito = (producto = null, cantidad = 1) => {
    if (!validarAutenticacion()) {
      return false;
    }

    if (producto && producto.id) {
      return agregarAlCarrito(producto, cantidad);
    }

    if (Array.isArray(producto)) {
      setCart(producto);
      return true;
    }

    setCart([]);
    return true;
  };

  const agregarAlCarrito = (producto, cantidad = 1) => {
    if (!validarAutenticacion()) {
      return false;
    }

    if (!producto || !producto.id) return false;

    const cantNum = Math.max(1, Number(cantidad) || 1);
    const numStock = Number(producto.stock);
    const stockDisponible = Number.isFinite(numStock) ? numStock : Infinity;

    if (stockDisponible <= 0) {
      return false;
    }

    setCart((prevCart) => {
      const index = prevCart.findIndex((item) => item.id === producto.id);

      if (index >= 0) {
        // El producto ya está en el carrito: aumentamos la cantidad respetando el stock
        const itemActual = prevCart[index];
        const nuevaCantidad = Math.min(itemActual.cantidad + cantNum, stockDisponible);

        const nuevoCart = [...prevCart];
        nuevoCart[index] = {
          ...itemActual,
          cantidad: nuevaCantidad,
        };
        return nuevoCart;
      } else {
        let imagenPrincipal = null;
        if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
          imagenPrincipal = producto.imagenes[0]?.imagen || producto.imagenes[0];
        } else if (producto.imagen) {
          imagenPrincipal = typeof producto.imagen === "string" ? producto.imagen : producto.imagen?.imagen;
        }

        const nuevoItem = {
          id: producto.id,
          nombre: producto.nombre || "Pieza 3D Personalizada",
          precio: Number(producto.precio) || 0,
          cantidad: Math.min(cantNum, stockDisponible),
          stock: stockDisponible,
          imagen: imagenPrincipal,
          categoria: producto.categoria?.nombre || producto.categoria || "Impresión 3D",
          tags: generarTagsParaProducto(producto),
        };

        return [...prevCart, nuevoItem];
      }
    });

    return true;
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (!validarAutenticacion()) {
      return;
    }

    const cantNum = Number(nuevaCantidad);
    if (isNaN(cantNum)) return;

    if (cantNum <= 0) {
      eliminarDelCarrito(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const numStock = Number(item.stock);
          const maxStock = Number.isFinite(numStock) ? numStock : Infinity;
          return {
            ...item,
            cantidad: Math.min(cantNum, maxStock),
          };
        }
        return item;
      })
    );
  };

  const decrementarCantidad = (id) => {
    if (!validarAutenticacion()) {
      return;
    }

    setCart((prevCart) => {
      const item = prevCart.find((it) => it.id === id);
      if (!item) return prevCart;
      if (item.cantidad <= 1) {
        return prevCart;
      }
      return prevCart.map((it) =>
        it.id === id ? { ...it, cantidad: it.cantidad - 1 } : it
      );
    });
  };

  const incrementarCantidad = (id) => {
    if (!validarAutenticacion()) {
      return;
    }

    setCart((prevCart) =>
      prevCart.map((it) => {
        if (it.id === id) {
          const numStock = Number(it.stock);
          const maxStock = Number.isFinite(numStock) ? numStock : Infinity;
          if (it.cantidad < maxStock) {
            return { ...it, cantidad: it.cantidad + 1 };
          }
        }
        return it;
      })
    );
  };

  const eliminarDelCarrito = (id) => {
    if (!validarAutenticacion()) {
      return;
    }

    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    if (!validarAutenticacion()) {
      return;
    }

    setCart([]);
  };

  const estaEnCarrito = (id) => {
    return cart.some((item) => item.id === id);
  };

  const obtenerCantidad = (id) => {
    const item = cart.find((it) => it.id === id);
    return item ? item.cantidad : 0;
  };

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + (item.cantidad || 0), 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (Number(item.precio) || 0) * (item.cantidad || 0), 0);
  }, [cart]);

  const costoEnvio = useMemo(() => {
    return cart.length > 0 ? 100.00 : 0.00;
  }, [cart]);

  const impuestos = 0.00;

  const total = useMemo(() => {
    return subtotal + costoEnvio + impuestos;
  }, [subtotal, costoEnvio, impuestos]);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        subtotal,
        costoEnvio,
        impuestos,
        total,
        crearCarrito,
        agregarAlCarrito,
        actualizarCantidad,
        incrementarCantidad,
        decrementarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        estaEnCarrito,
        obtenerCantidad,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
