const BASE_URL = import.meta.env.VITE_OCI_PUBLIC_URL;
const FALLBACK_URL = 'MJMI/Home/Fail.webp';

export const getAsset = (relativePath) => {
    if (!relativePath) return `${BASE_URL}/${FALLBACK_URL}`;
    return `${BASE_URL}/${relativePath}`;
};