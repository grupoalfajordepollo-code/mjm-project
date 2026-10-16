const BACKEND_URL = 'http://localhost:3000/api';

export const getAsset = (relativePath) => {
    // Si no hay ruta en la DB, devuelve el placeholder público del front
    if (!relativePath) return '/placeholder.webp';

    // Si ya viene con protocolo absoluto (http:// o https://)
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }

    // Para imágenes locales guardadas en Express (/archivos/images/...)
    const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `${BACKEND_URL}${cleanPath}`;
};
