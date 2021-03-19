import { string } from "yup";

const schema = (type: string) => {
  switch (type) {
    case "email":
      return string()
        .email("Email tidak sesuai format, mohon cek kembali")
        .required("Email wajib diisi");

    case "password":
      return string()
        .min(6, "Password minimal 6 karakter")
        .max(16, "Password maximal 16 karakter")
        .matches(
          /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/,
          "Kriteria password wajib 1 huruf kapital, 1 symbol, 1 angka"
        )
        .required("Password wajib diisi");

    case "arsipId":
      return string().trim().required("Arsip wajib diisi!");

    case "nomorSurat":
      return string().trim().required("Mohon reservasi nomor surat");

    case "tujuanDinas":
      return string().trim().required("Nama Dinas / Tujuan Dinas Wajib diisi");

    // TODO: tambah lagi validation untuk di form surat
    default:
      return undefined;
  }
};

const createSchema = (initialValues: Record<string, string>) => {
  const fieldNames = Object.keys(initialValues);
  return !Array.isArray(fieldNames) || fieldNames.length === 0
    ? undefined
    : fieldNames.reduce((acc, type) => {
        return {
          ...acc,
          [type]: schema(type),
        };
      }, {});
};

export default createSchema;
