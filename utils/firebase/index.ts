import admin from "firebase-admin";
import { serviceAccount } from "./serviceAccount";

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
    }),
    projectId: serviceAccount.project_id,
    storageBucket: "kjri-fr-dev.appspot.com",
  });
} catch (error) {
  admin.app();
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage().bucket(serviceAccount.bucket_name);

export { db, auth, storage };
