import fs from "fs";
import crypto from "crypto";

let client = null;
let ociModules = null;
const NAMESPACE = process.env.OCI_NAMESPACE;
const BUCKET = process.env.OCI_BUCKET_NAME;

const log = (msg) => console.log(`[OCI] ${msg}`);

const getClient = async () => {
  if (client) return client;

  if (!ociModules) {
    const pkg = await import("oci-sdk");
    ociModules = pkg;
  }
  const { objectstorage, common } = ociModules;
  const { ObjectStorageClient } = objectstorage;

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