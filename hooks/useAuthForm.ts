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
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      try {
        await mutateAsync(values);
      } catch (e) {
        return toast.error(e.message);
      }

      await replace("/dashboard");
      setSubmitting(false);
    },
  });
};

export default useAuthForm;
