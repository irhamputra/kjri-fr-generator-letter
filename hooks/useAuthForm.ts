import { useRouter } from "next/router";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import useValidation from "./useValidation";
import useAuthMutation from "./mutation/useAuthMutation";

const useAuthForm = <T>(initialValues: T, type: "login" | "register") => {
  const { replace } = useRouter();
  const validationSchema = useValidation<T>(initialValues);
  const { mutateAsync } = useAuthMutation<T>(type);

  return useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        await mutateAsync(values);
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
