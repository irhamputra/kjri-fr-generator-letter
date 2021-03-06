import { useRouter } from "next/router";
import { useFormik } from "formik";
import useValidation from "./useValidation";
import sleep from "../utils/sleep";

interface InitialValues {
  [k: string]: string;
}

const useAuthForm = (initialValues: InitialValues) => {
  const { replace } = useRouter();
  const validationSchema = useValidation(Object.keys(initialValues));

  return useFormik<InitialValues>({
    initialValues,
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
