import { Producto, Categoria, Imagenes, Administrador } from "../models/index.js";


// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        {
          model: Categoria,
          as: "categoria",
        },
        {
          model: Imagenes,
          as: "imagenes",
        },
        {
          model: Administrador,
          as: "administrador",
          attributes: ["id", "nombre", "apellido"],
        },
      ],
      order: [[{model : Imagenes, as:"imagenes"}, "orden", "ASC"]]
    });

    res.json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};


// Obtener producto por ID
export const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [
        {
          model: Categoria,
          as: "categoria",
        },
        {
          model: Imagenes,
          as: "imagenes",
        },
        {
          model: Administrador,
          as: "administrador",
          attributes: ["id", "nombre", "apellido"],
        },
      ],
      order: [[{model : Imagenes, as:"imagenes"}, "orden", "ASC"]]

    });

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};


// Crear producto
export const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      idCategoria,
      idAdministrador,
    } = req.body;

    const producto = await Producto.create({
      nombre,
      descripcion,
      precio,
      stock,
      idCategoria,
      idAdministrador,
    });
    const productoCreado = await Producto.findByPk(producto.id, {
      include: [
        { model: Categoria, as: "categoria" },
        { model: Imagenes, as: "imagenes" },
        { model: Administrador, as: "administrador", attributes: ["id", "nombre", "apellido"] },
      ],
      order: [[{model : Imagenes, as:"imagenes"}, "orden", "ASC"]]

    });
    res.status(201).json(productoCreado);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};


// Modificar producto
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    const {
      nombre,
      descripcion,
      precio,
      stock,
      idCategoria,
      idAdministrador,
    } = req.body;

    await producto.update({
      nombre,
      descripcion,
      precio,
      stock,
      idCategoria,
      idAdministrador,
      fechaAdmin: new Date(),
    });

    const productoActualizado = await Producto.findByPk(producto.id, {
      include: [
        { model: Categoria, as: "categoria" },
        { model: Imagenes, as: "imagenes" },
        { model: Administrador, as: "administrador", attributes: ["id", "nombre", "apellido"] },
      ],
       order: [[{model : Imagenes, as:"imagenes"}, "orden", "ASC"]]

    });
    res.json(productoActualizado);

  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};


// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    await producto.destroy();

    // Las imágenes son paranoid (soft delete) igual que el producto, por eso
    // el ON DELETE SET NULL de la FK nunca se dispara (no hay DELETE físico).
    // Se liberan a nivel app: quedan huérfanas y reutilizables.
    await Imagenes.update(
      { idProducto: null },
      { where: { idProducto: req.params.id } }
    );

    res.json({
      mensaje: "Producto eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

