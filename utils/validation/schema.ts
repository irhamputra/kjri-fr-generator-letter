import { string } from "yup";

const schema = (type: string) => {
  switch (type) {
    // common schema
    case "displayName":
    case "nip":
    case "arsipId":
    case "jenisSurat":
    case "recipient":
    case "content":
    case "jenisArsip":
    case "acronym":
    case "tujuanDinas":
      return string().trim().min(3).required("Wajib diisi!");

    // Login & Register schema
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

    case "nomorSurat":
      return string().trim().required("Wajib reservasi nomor surat");

    // Server
    case "nama":
    case "golongan":
    case "jabatan":
      return string().trim().required("Value tidak valid");

    case "durasi":
      return string().matches(/^[0-9]?,[5]$/, "Value bukan angka dan koma");

    default:
      return undefined;
  }
};

const createSchema = <T>(initialValues: T) => {
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
