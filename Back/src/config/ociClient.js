import objectStorage from 'oci-objectstorage';
import common from 'oci-common';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env de la raíz de Back
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const keyPath = process.env.OCI_PRIVATE_KEY_PATH;

if (!keyPath) {
  throw new Error(`❌ No se encontró OCI_PRIVATE_KEY_PATH en el .env`);
}

const absoluteKeyPath = path.resolve(__dirname, '../../', keyPath);

if (!fs.existsSync(absoluteKeyPath)) {
  throw new Error(`❌ No existe el archivo .pem en: ${absoluteKeyPath}`);
}

// Leer y normalizar la clave PEM
const privateKeyContent = fs.readFileSync(absoluteKeyPath, 'utf8').trim();

// Usamos OCI_TENANCY_ID y OCI_USER_ID coincidiendo con tu .env
const customProvider = new common.SimpleAuthenticationDetailsProvider(
  process.env.OCI_TENANCY_ID?.trim(),
  process.env.OCI_USER_ID?.trim(),
  process.env.OCI_FINGERPRINT?.trim(),
  privateKeyContent,
  null,
  common.Region.fromRegionId(process.env.OCI_REGION?.trim())
);

export const client = new objectStorage.ObjectStorageClient({
  authenticationDetailsProvider: customProvider
});