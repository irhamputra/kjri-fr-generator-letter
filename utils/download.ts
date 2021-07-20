export function downloadURI(uri: string, name: string = "") {
  const link = document.createElement("a");
  link.download = "Surat_Tugas.docx";
  link.href = uri;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
