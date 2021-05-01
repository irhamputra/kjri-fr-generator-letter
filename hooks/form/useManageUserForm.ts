import { useRouter } from "next/router";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import useValidation from "./../useValidation";
import useEditUserById from "../mutation/useUserMutationById";

interface UseManageUserFormValues {
  displayName: string;
  email: string;
  golongan: string;
  jabatan: string;
  nip: string;
  role: string;
  password?: string;
}

const useManageUserForm = (initialValues: UseManageUserFormValues, userId: string) => {
  const { push } = useRouter();
  const validationSchema = useValidation<UseManageUserFormValues>(initialValues);
  const { mutateAsync } = useEditUserById<UseManageUserFormValues>(userId);

  return useFormik<UseManageUserFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (value, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        await mutateAsync(value);
      } catch (e) {
        return toast.error(e.message);
      }

      toast.success(`Update berhasil`);
      push("/pengaturan/manage-user");
      setSubmitting(false);
    },
  });
};

export default useManageUserForm;
