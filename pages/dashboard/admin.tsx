import * as React from "react";
import { NextPage } from "next";
import { useFormik } from "formik";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-hot-toast";
import ReactSwitch from "react-switch";

const Admin: NextPage = () => {
  const { data, isLoading, isError } = useQuery(
    ["fetchAdminSetting"],
    async () => {
      try {
        const { data } = await axios.get("/api/v1/admin");

        return data.showRegisterForm;
      } catch (e) {
        throw new Error(e.response.data.message);
      }
    },
    {}
  );

  const [checked, setChecked] = React.useState(data);

  const { mutateAsync } = useMutation(
    ["toggleRegisterForm"],
    async (toggle: boolean) => {
      try {
        await axios.post("/api/v1/admin", {
          toggle,
        });
      } catch (e) {
        throw new Error(e.response.data.message);
      }
    }
  );

  const { setValues, handleSubmit, isSubmitting } = useFormik({
    initialValues: {
      toggle: checked,
    },
    onSubmit: async ({ toggle }, { setSubmitting }) => {
      setSubmitting(true);

      try {
        await mutateAsync(toggle);
      } catch (e) {
        toast.error(e.message);
        throw new Error(e.message);
      }

      toast.success("Pengaturan berhasil disimpan");

      setSubmitting(false);
    },
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error</h1>;

  return (
    <>
      <h1>Admin Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <div>
          {checked && (
            <ReactSwitch
              disabled={isSubmitting}
              checked={checked}
              onChange={(toggle) => {
                setChecked(toggle);
                setValues({ toggle });
              }}
              id="toggle"
            />
          )}
          Tampilkan Registrasi Form
        </div>

        <button disabled={isSubmitting} type="submit">
          Simpan Pengaturan
        </button>
      </form>
    </>
  );
};

export default Admin;
