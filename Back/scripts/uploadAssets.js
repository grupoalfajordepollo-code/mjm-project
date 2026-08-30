import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

import { client } from '../src/config/ociClient.js';

const BUCKET_NAME = process.env.OCI_BUCKET_NAME;
const NAMESPACE = process.env.OCI_NAMESPACE;

const LOCAL_ASSETS_DIR = path.resolve(__dirname, '../../Front/src/assets');
const OUTPUT_MAP_FILE = path.resolve(__dirname, '../../Front/src/config/assetsMap.json');

function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

// Obtener la lista de objetos ya subidos al bucket bajo el prefijo "assets/"
async function getExistingOciObjects() {
  try {
    const response = await client.listObjects({
      namespaceName: NAMESPACE,
      bucketName: BUCKET_NAME,
      prefix: 'assets/'
    });
    return new Set(response.listObjects.objects.map(obj => obj.name));
  } catch (error) {
    console.warn('⚠️ No se pudo obtener la lista remota de OCI, se reintentarán todas las subidas.');
    return new Set();
  }
}

async function uploadAllAssets() {
  try {
    console.log('🚀 Escaneando assets locales desde:', LOCAL_ASSETS_DIR);

    const filePaths = getFilesRecursively(LOCAL_ASSETS_DIR);
    if (filePaths.length === 0) {
      console.error(`❌ No se encontraron archivos en: ${LOCAL_ASSETS_DIR}`);
      return;
    }

    // 1. Obtener objetos existentes en OCI
    const existingObjects = await getExistingOciObjects();
    const assetsMap = {};

    console.log(`📁 Se encontraron ${filePaths.length} archivos locales.`);

    for (const filePath of filePaths) {
      const relativePath = path.relative(LOCAL_ASSETS_DIR, filePath).replace(/\\/g, '/');
      const objectName = `assets/${relativePath}`;

      // Guardar mapeo
      assetsMap[relativePath] = objectName;

      // 2. Si el archivo ya existe en OCI, lo salteamos
      if (existingObjects.has(objectName)) {
        console.log(`⏭️  Omitido (ya existe en OCI): ${relativePath}`);
        continue;
      }

      console.log(`⬆️  Subiendo nuevo asset: ${relativePath} -> OCI: ${objectName}`);
      const fileStream = fs.createReadStream(filePath);

      await client.putObject({
        namespaceName: NAMESPACE,
        bucketName: BUCKET_NAME,
        objectName: objectName,
        putObjectBody: fileStream,
      });
    }

    // 3. Escribir o actualizar el JSON del mapa
    fs.mkdirSync(path.dirname(OUTPUT_MAP_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_MAP_FILE, JSON.stringify(assetsMap, null, 2));

    console.log('\n✅ ¡Proceso finalizado!');
    console.log(`📄 Mapa actualizado en: ${OUTPUT_MAP_FILE}\n`);

  } catch (error) {
    console.error('❌ Error durante el proceso:', error);
  }
}

uploadAllAssets();