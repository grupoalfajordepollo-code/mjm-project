import pkg from "oci-sdk";
import fs from "fs";
const { objectstorage, common } = pkg;
const { ObjectStorageClient } = objectstorage;

let client = null;
const NAMESPACE = process.env.OCI_NAMESPACE;
const BUCKET = process.env.OCI_BUCKET_NAME;

const getClient = () => {
  if (client) return client;

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
  return client;
};

export const subirImagen = async (buffer, nombreOriginal) => {
  const timestamp = Date.now();
  const nombreLimpio = nombreOriginal.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectName = `assets/productos/${timestamp}-${nombreLimpio}`;

  await getClient().putObject({
    namespaceName: NAMESPACE,
    bucketName: BUCKET,
    objectName,
    putObjectBody: buffer,
    contentType: "application/octet-stream",
  });

  return objectName.replace("assets/", "");
};
