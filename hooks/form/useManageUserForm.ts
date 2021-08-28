import { useRouter } from "next/router";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import useValidation from "./../useValidation";
import useEditUserById from "../mutation/useUserMutationById";
import { useEffect } from "react";
import { useAppState } from "../../contexts/app-state-context";

interface UseManageUserFormValues {
  displayName: string;
  email: string;
  golongan: string;
  jabatan: string;
  nip: string;
  role: string;
  password?: string;
  pangkat?: string;
}

const useManageUserForm = (initialValues: UseManageUserFormValues, userId: string) => {
  const { push } = useRouter();
  const validationSchema = useValidation<UseManageUserFormValues>(initialValues);
  const { mutateAsync } = useEditUserById<UseManageUserFormValues>(userId);
  const { dispatch } = useAppState();
  const { dirty, ...rest } = useFormik<UseManageUserFormValues>({
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

  useEffect(() => {
    dispatch({ type: "setIsEditing", payload: dirty });
  }, [dirty]);

  return { dirty, ...rest };
};

export default useManageUserForm;
