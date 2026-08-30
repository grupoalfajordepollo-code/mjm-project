const BASE_URL = import.meta.env.VITE_OCI_PUBLIC_URL;

export const getAsset = (relativePath) => {
    if (!relativePath) return '';
    return `${BASE_URL}/${relativePath}`;
};