
import express from 'express';
import objectStorage from 'oci-objectstorage';
import { client } from '../config/ociClient.js';

const router = express.Router();

// POST /api/upload/get-read-urls-batch
router.post('/get-read-urls-batch', async (req, res) => {
  try {
    const { objectNames } = req.body; // Recibe el array: ["assets/MJMI/Home/Hero.webp", ...]

    if (!objectNames || !Array.isArray(objectNames)) {
      return res.status(400).json({ error: 'Se requiere un array objectNames' });
    }

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24); // PARs válidas por 24h

    // Firma en paralelo todas las imágenes requeridas
    const urlPromises = objectNames.map(async (objectName) => {
      const createPARDetails = {
        name: `ASSET-READ-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        objectName: objectName,
        accessType: objectStorage.models.CreatePreauthenticatedRequestDetails.AccessType.ObjectRead,
        timeExpires: expirationDate
      };


      const response = await client.createPreauthenticatedRequest({
        namespaceName: process.env.OCI_NAMESPACE,
        bucketName: process.env.OCI_BUCKET_NAME,
        createPreauthenticatedRequestDetails: createPARDetails
      });

      const readUrl = `https://objectstorage.${process.env.OCI_REGION}.oraclecloud.com${response.preauthenticatedRequest.accessUri}`;
      return { [objectName]: readUrl };
    });

    const results = await Promise.all(urlPromises);
    
    // Mapea el array de objetos en un solo diccionario accesible por clave
    const urlMap = Object.assign({}, ...results);

    res.json(urlMap);
  } catch (error) {
    console.error('Error al generar lote de URLs:', error);
    res.status(500).json({ error: 'No se pudieron generar las URLs de los assets' });
  }
});

export default router;