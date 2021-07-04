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

export { createUrl };
