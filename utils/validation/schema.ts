import { string, array } from "yup";
import dayjs from "dayjs";
import capitalizeFirstLetter from "../capitalize";

const schema = (type: string) => {
  switch (type) {
    // common schema
    case "displayName":
    case "arsipId":
    case "label":
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
    case "role":
      return string()
        .trim()
        .required(`${type === "displayName" ? "Nama Pegawai" : capitalizeFirstLetter(type)} wajib diisi!`);

    case "identityNumber":
      return string().trim().max(5).required("Nomor identifikasi wajib diisi!");

    case "birthday":
      return string()
        .matches(/^\d{2}[./-]\d{2}[./-]\d{4}$/, "Format tanggal lahir salah. Contoh: 01/01/2000")
        .required("Tanggal lahir wajib diisi!");

    case "dob":
      return string()
        .test("dob", "Minimal umur 21 tahun", (val) => dayjs().diff(dayjs(val), "years") >= 21)
        .required("Tanggal lahir wajib diisi!");

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

    case "pangkat":
      return string().matches(/^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/);

    default:
      return undefined;
  }
};

const createSchema = <T>(initialValues: T) => {
  const fieldNames = Object.keys(initialValues);
  return !Array.isArray(fieldNames) || fieldNames.length === 0
    ? {}
    : fieldNames.reduce((acc, type) => {
        return {
          ...acc,
          [type]: schema(type),
        };
      }, {});
};

export default createSchema;
