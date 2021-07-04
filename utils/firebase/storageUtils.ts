import { storage } from ".";

function createUrl(fileName: string, publicToken: string) {
  const bucketName = "kjri-fr-dev.appspot.com";
  return (
    "https://firebasestorage.googleapis.com/v0/b/" +
    bucketName +
    "/o/" +
    encodeURIComponent(fileName) +
    "?alt=media&token=" +
    publicToken
  );
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
