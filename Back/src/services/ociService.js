import fs from "fs";
import https from "https";
import http from "http";

let client = null;
let ociModules = null;
const NAMESPACE = process.env.OCI_NAMESPACE;
const BUCKET = process.env.OCI_BUCKET_NAME;

const keepAliveAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 10,
  maxFreeSockets: 5,
  timeout: 60000,
});

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

  const clientConfiguration = {
    timeoutIfExists: 60000,
  };

  client = new ObjectStorageClient({
    authenticationDetailsProvider,
    clientConfiguration,
    requestInterceptor: {
      options: {
        agent: keepAliveAgent,
      },
    },
  });

  return client;
};

export const subirImagen = async (buffer, nombreOriginal) => {
  const timestamp = Date.now();
  const nombreLimpio = nombreOriginal.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectName = `assets/productos/${timestamp}-${nombreLimpio}`;

  const client = await getClient();
  await client.putObject({
    namespaceName: NAMESPACE,
    bucketName: BUCKET,
    objectName,
    putObjectBody: buffer,
    contentType: "application/octet-stream",
  });

  return objectName.replace("assets/", "");
};
