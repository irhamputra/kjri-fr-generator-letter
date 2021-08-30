import { useMutation } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../utils/validation/schema";
import { useRouter } from "next/router";

const useRegisterAccount = <T>(initialValues: T) => {
  const { query, replace } = useRouter();
  const { mutateAsync, ...restMutation } = useMutation(
    "registerUser",
    async (values: Omit<typeof initialValues, "identityNumber" | "birthday">) => {
      const { data } = await axios.post("/api/v1/register", { ...values, uid: query?.id });

      return data;
    },
    {
      onSuccess: async () => {
        toast.success("Email verifikasi telah terkirim!");
        await replace("/", undefined, { shallow: true });
      },
    }
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      await mutateAsync(values);
      setSubmitting(false);
    },
  });

  return {
    ...formik,
    ...restMutation,
  };
};

export default useRegisterAccount;
