import api from "./api"

export const subirImagen = async (file, descripcion = "", idProducto = null) =>{
    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("descripcion",descripcion)
    if (idProducto) formData.append("idProducto", idProducto);

    const response = await api.post("/upload", formData, {
        headers : {"Content-Type": "multipart/form-data"},
    })

    return response.data;
}