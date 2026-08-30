import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import localAssetsMap from '../config/assetsMap.json';

const AssetsContext = createContext();

// Clave única para localStorage
const CACHE_KEY = 'oci_assets_cache_v1';
// Tiempo de vida del caché: 23 horas (para renovar antes de que venza la PAR de 24h)
const CACHE_TTL_MS = 23 * 60 * 60 * 1000;

export function AssetsProvider({ children }) {
  const [resolvedUrls, setResolvedUrls] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssetUrls() {
      try {
        const ociPaths = Object.values(localAssetsMap);

        if (ociPaths.length === 0) {
          setLoading(false);
          return;
        }

        // 1. INTENTAR LEER DESDE EL CACHÉ LOCAL
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
          const { urls, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > CACHE_TTL_MS;

          // Verificar si el caché es válido y contiene todos los assets actuales
          const hasAllAssets = ociPaths.every((path) => Boolean(urls[path]));

          if (!isExpired && hasAllAssets) {
            setResolvedUrls(urls);
            setLoading(false);
            return; // 🚀 Salida ultra rápida en 0 ms
          }
        }

        // 2. SI NO HAY CACHÉ O EXPIRÓ -> SOLICITAR AL BACKEND
        const { data } = await api.post('/upload/get-read-urls-batch', {
          objectNames: ociPaths,
        });

        // 3. GUARDAR RESULTADO EN CACHÉ LOCAL CON TIMESTAMP
        const cachePayload = {
          urls: data,
          timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
        setResolvedUrls(data);

      } catch (error) {
        console.error('Error al cargar las URLs de los assets:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAssetUrls();
  }, []);

  const getAsset = (localPath) => {
    const ociPath = localAssetsMap[localPath];
    return resolvedUrls[ociPath] || '';
  };

  return (
    <AssetsContext.Provider value={{ getAsset, loading }}>
      {children}
    </AssetsContext.Provider>
  );
}

export const useAssets = () => useContext(AssetsContext);