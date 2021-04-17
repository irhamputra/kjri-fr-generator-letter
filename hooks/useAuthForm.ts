import { useRouter } from "next/router";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import useValidation from "./useValidation";
import useAuthMutation from "./mutation/useAuthMutation";

const useAuthForm = <T extends { nip: string }>(
  initialValues: T,
  type: "login" | "register"
) => {
  const { replace } = useRouter();
  const validationSchema = useValidation<T>(initialValues);
  const { mutateAsync } = useAuthMutation<T>(type);

  return useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      const { nip: nipVal, ...restValues } = values;

      const nip = nipVal === "" ? "-" : nipVal;

      try {
        await mutateAsync({ nip, ...restValues } as T);
      } catch (e) {
        return toast.error(e.message);
      }

      toast.success(`${type} berhasil`);

      if (type === "login") {
        await replace("/dashboard");
      }

      if (type === "register") {
        resetForm();
      }

      setSubmitting(false);
    },
  });
};

export default useAuthForm;
