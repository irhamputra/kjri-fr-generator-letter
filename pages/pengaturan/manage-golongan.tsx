import * as React from "react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../../utils/validation/schema";
import useQueryJalDir from "../../hooks/useQueryJalDir";
import axios from "axios";
import { toast } from "react-hot-toast";
import { NextSeo } from "next-seo";

const ManageGolongan: NextPage = () => {
  const initialValues = {
    jenisGolongan: "",
    hargaGolongan: "",
  };

  const {
    handleChange,
    handleSubmit,
    values,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await axios.post("/api/v1/jaldir", {
          golongan: values.jenisGolongan,
          harga: values.hargaGolongan,
        });
        toast.success("Data berhasil disimpan");
      } catch (e) {
        toast.error("Terjadi kesalahan teknis! Mohon ulangi kembali");
        throw new Error(e.message);
      }

      setSubmitting(false);
    },
  });

  const { data, isLoading } = useQueryJalDir(isSubmitting);

  if (isLoading) return <h4>Loading...</h4>;

  return (
    <>
      <NextSeo
        title="Manage Golongan | Sistem Aplikasi KJRI Frankfurt"
        description="Manage Golongan Sistem Aplikasi KJRI Frankfurt"
      />
      <h4>Manage Golongan</h4>
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

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Golongan</th>
            <th scope="col">Harga</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v, i) => (
            <tr key={i + 1}>
              <td scope="row">{v.golongan}</td>
              <td>$ {v.harga}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ManageGolongan;
