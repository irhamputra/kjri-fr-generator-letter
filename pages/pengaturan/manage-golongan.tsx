import * as React from "react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../../utils/validation/schema";
import useQueryJalDir from "../../hooks/query/useQueryJalDir";
import { toast } from "react-hot-toast";
import { NextSeo } from "next-seo";
import useDeleteGolonganMutation from "../../hooks/mutation/useDeleteGolonganMutation";
import useCreateGolonganMutation from "../../hooks/mutation/useCreateGolonganMutation";

const ManageGolongan: NextPage = () => {
  const initialValues = {
    jenisGolongan: "",
    hargaGolongan: "",
    golId: "",
  };

  const { data, isLoading } = useQueryJalDir();
  const { mutateAsync: createGolongan } = useCreateGolonganMutation();
  const { mutateAsync: deleteGolongan } = useDeleteGolonganMutation();

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        await createGolongan(values);
      } catch (e) {
        toast.error("Terjadi kesalahan teknis! Mohon ulangi kembali");
        throw new Error(e.message);
      }

      resetForm();
      setSubmitting(false);
    },
  });

  if (isLoading) return <h4>Loading...</h4>;

  return (
    <>
      <NextSeo
        title="Manage Golongan | Sistem Aplikasi KJRI Frankfurt"
        description="Manage Golongan Sistem Aplikasi KJRI Frankfurt"
      />
      <h4 className="mt-3">Manage Golongan</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label className="form-label">Jenis Golongan</label>
            <input
              name="jenisGolongan"
              value={values.jenisGolongan}
              onChange={handleChange}
              className="form-control"
            />
            {errors.jenisGolongan && touched.jenisGolongan && (
              <small className="text-danger">{errors.jenisGolongan}</small>
            )}
          </div>

          <div className="col">
            <label className="form-label">Harga</label>
            <input
              name="hargaGolongan"
              value={values.hargaGolongan}
              onChange={handleChange}
              className="form-control"
            />
            {errors.hargaGolongan && touched.hargaGolongan && (
              <small className="text-danger">{errors.hargaGolongan}</small>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-dark mt-3">
          Submit Golongan
        </button>
      </form>

      <table className="table mt-3">
        <thead>
          <tr>
            <th scope="col">Golongan</th>
            <th scope="col">Harga</th>
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody>
          {data?.map?.((v) => (
            <tr key={v.golId}>
              <td scope="row">{v.golongan}</td>
              <td>$ {v.harga}</td>
              <td>
                <button
                  className="btn btn-danger mx-3"
                  onClick={async () => await deleteGolongan(v.golId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ManageGolongan;
