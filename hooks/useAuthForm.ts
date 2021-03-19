import { useRouter } from "next/router";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import useValidation from "./useValidation";
import useAuthMutation from "./Mutation/useAuthMutation";

import type { InitialValues } from "../typings/InitialValues";

const useAuthForm = (
  initialValues: InitialValues,
  type: "login" | "register"
) => {
  const { replace } = useRouter();
  const validationSchema = useValidation(initialValues);
  const { mutateAsync } = useAuthMutation(type);

  return useFormik<InitialValues>({
    initialValues,
    validationSchema,
    onSubmit: async (v, { setSubmitting }) => {
      setSubmitting(true);

      try {
        await mutateAsync(v);
      } catch (e) {
        return toast.error(e.message);
      }

      await replace("/dashboard");

      toast.success("Login berhasil");
      setSubmitting(false);
    },
  });
};

export default useAuthForm;
