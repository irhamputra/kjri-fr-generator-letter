import { useMutation } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../utils/validation/schema";

const useVerifyAccount = <T>(initialValues: T) => {
  const { push } = useRouter();

  const { mutateAsync, ...restMutation } = useMutation(
    "verification",
    async (values: Omit<typeof initialValues, "email" | "password">) => {
      try {
        const { data } = await axios.post("/api/v1/verification", values);

        return data;
      } catch (e) {
        toast.error("Kode sudah pernah terverifikasi");
        throw new Error("User tidak ditemukan");
      }
    },
    {
      onSuccess: async (data) => {
        toast.success("Verifikasi berhasil");
        await push({ pathname: "/register", query: { code: data.codeId, id: data.uuid } });
      },
    }
  );

  const formik = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      await mutateAsync(values);
      setSubmitting(false);
    },
  });

  return { mutateAsync, ...restMutation, ...formik };
};

export default useVerifyAccount;
