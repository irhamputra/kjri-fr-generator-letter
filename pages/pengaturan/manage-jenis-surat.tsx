import * as React from "react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../../utils/validation/schema";
import { toast } from "react-hot-toast";
import { NextSeo } from "next-seo";
import { Trash } from "react-bootstrap-icons";
import useWarnUnsavedChange from "../../hooks/useWarnUnsavedChange";
import useQueryJenisSurat from "../../hooks/query/useQueryJenisSurat";
import useCreateJenisSurat from "../../hooks/mutation/useCreateJenisSurat";
import useDeleteJenisSurat from "../../hooks/mutation/useDeleteJenisSurat";

const ManageJenisSurat: NextPage = () => {
  const initialValues = {
    label: "",
  };

  const { isLoading, data } = useQueryJenisSurat();
  const { mutateAsync: createJenisSurat } = useCreateJenisSurat();
  const { mutateAsync: deleteJenisSurat } = useDeleteJenisSurat();

  const { handleChange, values, touched, errors, handleSubmit, isSubmitting, dirty } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        await createJenisSurat(values);
      } catch (e) {
        toast.error("Gagal menyimpan data!");
        throw new Error(e.message);
      }

      resetForm();
      finishEditing();
      setSubmitting(false);
    },
  });

  const { finishEditing } = useWarnUnsavedChange(dirty);

  if (isLoading) return <h4>Loading...</h4>;

  return (
    <section style={{ marginTop: "6rem" }} className="mb-5">
      <NextSeo
        title="Manage Jenis Surat | Sistem Aplikasi KJRI Frankfurt"
        description="Manage Arsip Sistem Aplikasi KJRI Frankfurt"
      />
      <h4>Manage Jenis Surat</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label className="form-label">Jenis Arsip</label>
            <input
              disabled={isSubmitting}
              className="form-control"
              name="label"
              value={values.label}
              onChange={handleChange}
            />
            {errors.label && touched.label && <small className="text-danger">{errors.label}</small>}
          </div>
        </div>

        <button className="btn-dark btn mt-3" disabled={isSubmitting} type="submit">
          Simpan Jenis Surat
        </button>
      </form>
      <table className="table caption-top mt-3">
        <caption>Table Jenis Surat</caption>
        <thead>
          <tr>
            <th scope="col">Jenis Surat</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((v: typeof initialValues & { id: string }) => {
            return (
              <tr key={v.id}>
                <th scope="row">{v.label}</th>
                <td>
                  <button
                    type="button"
                    className="btn btn btn-outline-danger"
                    onClick={async () => {
                      await deleteJenisSurat(v.id);
                    }}
                  >
                    <Trash size={20} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default ManageJenisSurat;
