import * as React from "react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../../utils/validation/schema";
import { toast } from "react-hot-toast";
import { NextSeo } from "next-seo";
import useQueryArsip from "../../hooks/query/useQueryArsip";
import { Trash } from "react-bootstrap-icons";
import useDeleteArsipMutatition from "../../hooks/mutation/useDeleteArsipMutatition";
import useCreateArsipMutation from "../../hooks/mutation/useCreateArsipMutation";

const ManageArsip: NextPage = () => {
  const initialValues = {
    jenisArsip: "",
    acronym: "",
  };

  const { isLoading, data } = useQueryArsip();
  const { mutateAsync: createArsip } = useCreateArsipMutation();
  const { mutateAsync: deleteArsip } = useDeleteArsipMutatition();

  const { handleChange, values, touched, errors, handleSubmit, isSubmitting } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        await createArsip(values);
      } catch (e) {
        toast.error("Gagal menyimpan data!");
        throw new Error(e.message);
      }

      resetForm();
      setSubmitting(false);
    },
  });

  if (isLoading) return <h4>Loading...</h4>;

  return (
    <section style={{ marginTop: "6rem" }}>
      <NextSeo
        title="Manage Arsip | Sistem Aplikasi KJRI Frankfurt"
        description="Manage Arsip Sistem Aplikasi KJRI Frankfurt"
      />
      <h4>Manage Arsip</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label className="form-label">Jenis Arsip</label>
            <input
              disabled={isSubmitting}
              className="form-control"
              name="jenisArsip"
              value={values.jenisArsip}
              onChange={handleChange}
            />
            {errors.jenisArsip && touched.jenisArsip && <small className="text-danger">{errors.jenisArsip}</small>}
          </div>

          <div className="col">
            <label className="form-label">Akronim</label>
            <input
              disabled={isSubmitting}
              className="form-control"
              name="acronym"
              value={values.acronym}
              onChange={handleChange}
            />

            {errors.acronym && touched.acronym && <small className="text-danger">{errors.acronym}</small>}
          </div>
        </div>

        <button className="btn-dark btn mt-3" disabled={isSubmitting} type="submit">
          Simpan Arsip
        </button>
      </form>
      <table className="table caption-top mt-3">
        <caption>Table Jenis Arsip</caption>
        <thead>
          <tr>
            <th scope="col">Jenis Arsip</th>
            <th scope="col">Akronim</th>
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((v: typeof initialValues & { arsipId: string }) => {
            return (
              <tr key={v.jenisArsip}>
                <th scope="row">{v.jenisArsip}</th>
                <td>{v.acronym}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn btn-outline-danger"
                    onClick={async () => {
                      await deleteArsip(v.arsipId);
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

export default ManageArsip;
