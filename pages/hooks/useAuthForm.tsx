import { useRouter } from "next/router";
import { useFormik } from "formik";
import useValidation from "./useValidation";

interface LoginForm {
  email: string;
  password: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useAuthForm = () => {
  const { replace } = useRouter();
  const validationSchema = useValidation(["email", "password"]);

  return useFormik<LoginForm>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (v, { setSubmitting }) => {
      setSubmitting(true);
      await sleep(1500);
      console.log({ v });

      // TODO: save token to Cookie and replace url
      await replace("/dashboard");
      setSubmitting(false);
    },
  });
};

export default useAuthForm;
