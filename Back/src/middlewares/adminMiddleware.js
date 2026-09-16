export const adminMiddleware = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({
      mensaje: "Acceso denegado. Se requiere rol de administrador."
    });
  }
  next();
};
