import { useRouter } from "next/router";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import useValidation from "./useValidation";
import useAuthMutation from "./mutation/useAuthMutation";

interface UseAuthFormValues {
  displayName?: string;
  email?: string;
  golongan?: string;
  jabatan?: string;
  nip?: string;
  role?: string;
  password?: string;
}

const useAuthForm = (
  initialValues: UseAuthFormValues,
  type: "login" | "register"
) => {
  const { replace } = useRouter();
  const validationSchema = useValidation<UseAuthFormValues>(initialValues);
  const { mutateAsync } = useAuthMutation<UseAuthFormValues>(type);

  return useFormik<UseAuthFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (value, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      const { nip: nipVal, ...restValues } = value;
      const nip = nipVal === "" ? "-" : nipVal;

      const values = type === "register" ? { nip, ...restValues } : restValues;

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
