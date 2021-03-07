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
  console.log("Firebase admin initialization error", error.stack);
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { db, auth, storage };
