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

    // TODO: tambah lagi validation untuk di form surat
    default:
      return undefined;
  }
};

const createSchema = (keySchema: string[]) => {
  return !Array.isArray(keySchema) || keySchema.length === 0
    ? undefined
    : keySchema.reduce((acc, type) => {
        return {
          ...acc,
          [type]: schema(type),
        };
      }, {});
};

export default createSchema;
