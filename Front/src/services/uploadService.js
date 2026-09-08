import api from "./api"

export const subirImagen = async (file,descripcion = "" ) =>{
    const formData = new FormData();
    formData.append("imagen", file);
    formData.append("descripcion",descripcion)

    const response = await api.post("/upload", formData, {
        headers : {"Content-Type": "multipart/form-data"},
    })

    return response.data;
}