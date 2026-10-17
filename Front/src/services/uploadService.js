import api from "./api";

export const subirImagenes = async (files, idProducto = null, descripcion = "") => {
    const formData = new FormData();
    const listaArchivos = Array.isArray(files) ? files : [files];

    listaArchivos.forEach((file) => {
        formData.append("imagenes", file);
    });

    if (idProducto) formData.append("idProducto", idProducto);
    if (descripcion) formData.append("descripcion", descripcion);

    const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data; // Devuelve el array de imágenes creadas
};
