import { string, array } from "yup";
import capitalizeFirstLetter from "../capitalize";

const schema = (type: string) => {
  switch (type) {
    // common schema
    case "displayName":
    case "arsipId":
    case "jenisSurat":
    case "recipient":
    case "content":
    case "jenisArsip":
    case "acronym":
    case "tujuanDinas":
    case "nomorSurat":
    case "jenisGolongan":
    case "namaPegawai":
    case "hargaGolongan":
    case "golongan":
    case "jabatan":
    case "roles":
      return string()
        .trim()
        .required(`${type === "displayName" ? "Nama Pegawai" : capitalizeFirstLetter(type)} wajib diisi!`);

    // Login & Register schema
    case "email":
      return string().email("Email tidak sesuai format, mohon cek kembali").required("Email wajib diisi");

    case "password":
      return string()
        .min(6, "Password minimal 6 karakter")
        .max(16, "Password maximal 16 karakter")
        .matches(
          /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/,
          "Kriteria password wajib 1 huruf kapital, 1 symbol, 1 angka"
        )
        .required("Password wajib diisi");

    // Server
    case "nama":
      return string().trim().required("Value tidak valid");

    case "surat":
      return array().min(1, "wajib menyertakan surat").required("Silahkan upload surat");

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
