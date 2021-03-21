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
    case "jenisSurat":
      return string().trim().required("Arsip wajib diisi!");

    case "nomorSurat":
      return string().trim().required("Mohon reservasi nomor surat");

    case "tujuanDinas":
      return string().trim().required("Nama Dinas / Tujuan Dinas Wajib diisi");

    case "kelasArsip":
      return string().trim().required("Jenis arsip wajib diisi!");

    case "acronym":
      return string().trim().required("Akronim Wajib diisi!");

    case "recipient":
    case "content":
    case "jenisArsip":
      return string().trim().required("Input wajib diisi!");

    // Server
    case "nama":
    case "golongan":
    case "jabatan":
      return string().trim().required("Value tidak valid");

    case "durasi":
      return string().matches(/^[0-9]?,[5]$/, "Value bukan angka dan koma");
    case "jenisGolongan":
      return string().trim().required("Jenis golongan wajib diisi!");
    case "hargaGolongan":
      return string().trim().required("Harga golongan wajib diisi!");
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
