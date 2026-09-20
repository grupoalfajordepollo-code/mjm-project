import fs from "fs";
import crypto from "crypto";

let client = null;
let ociModules = null;
const NAMESPACE = process.env.OCI_NAMESPACE;
const BUCKET = process.env.OCI_BUCKET_NAME;

const log = (msg) => console.log(`[OCI] ${msg}`);

// Visible al arranque (costo cero): el cliente pesado se carga en el primer
// upload, no acá. Si ves demora en un primer upload, es esto (ver NOTA en getClient).
log("Modo lazy activo: el cliente se cargará en el primer upload");

const getClient = async () => {
  if (client) return client;

  // NOTA PARA EL EQUIPO: se importan solo los submódulos necesarios
  // (oci-objectstorage + oci-common) en vez del meta-paquete "oci-sdk"
  // completo, que carga cientos de servicios, tarda minutos en disco frío,
  // satura el event loop y volteaba el servidor (la conexión a MySQL
  // expiraba con ETIMEDOUT). Estos dos paquetes vienen con oci-sdk
  // (misma versión); si algún día se elimina esa dependencia, agregarlos
  // explícitos en package.json.
  if (!ociModules) {
    log("Cargando módulos OCI (objectstorage + common, solo primera vez)...");
    const t0 = Date.now();
    const [{ ObjectStorageClient }, common] = await Promise.all([
      import("oci-objectstorage"),
      import("oci-common"),
    ]);
    ociModules = { ObjectStorageClient, common };
    log(`Módulos OCI cargados en ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
  const { ObjectStorageClient, common } = ociModules;

  const privateKey = fs.readFileSync(process.env.OCI_PRIVATE_KEY_PATH, "utf8");

  const authenticationDetailsProvider = new common.SimpleAuthenticationDetailsProvider(
    process.env.OCI_TENANCY_ID,
    process.env.OCI_USER_ID,
    process.env.OCI_FINGERPRINT,
    privateKey,
    null,
    common.Region.fromRegionId(process.env.OCI_REGION)
  );

  client = new ObjectStorageClient({ authenticationDetailsProvider });
  log("Cliente OCI inicializado");
  return client;
};

export const subirImagen = async (buffer, nombreOriginal) => {
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  const nombreLimpio = nombreOriginal.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectName = `assets/productos/${hash}-${nombreLimpio}`;
  const client = await getClient();

  log(`Subiendo: ${objectName}`);
  await client.putObject({
    namespaceName: NAMESPACE,
    bucketName: BUCKET,
    objectName,
    putObjectBody: buffer,
    contentType: "application/octet-stream",
  });
  log(`Subido OK`);
  return objectName.replace("assets/", "");
};