import { storage } from ".";
import { serviceAccount } from "./serviceAccount";

function createUrl(fileName: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${serviceAccount.bucket_name}/o/${encodeURIComponent(
    fileName
  )}?alt=media`;
}

async function createSignedUrl(url: string) {
  const fileRef = storage.bucket().file(url);

  const signedUrl = await fileRef.getSignedUrl({
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes,
  });

  return signedUrl[0];
}

export { createUrl, createSignedUrl };
