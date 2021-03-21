import * as React from "react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../../utils/validation/schema";
import { toast } from "react-hot-toast";
import axios from "axios";
import useQueryArsip from "../../hooks/useQueryArsip";
import { NextSeo } from "next-seo";

const ManageArsip: NextPage = () => {
  const initialValues = {
    jenisArsip: "",
    acronym: "",
  };

  const {
    handleChange,
    values,
    touched,
    errors,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        await axios.post("/api/v1/arsip", values);
        toast.success("Berhasil menyimpan data!");
      } catch (e) {
        toast.error("Gagal menyimpan data!");
        throw new Error(e.message);
      }

      resetForm();
      setSubmitting(false);
    },
  });

  const { isLoading, data } = useQueryArsip(isSubmitting);

  if (isLoading) return <h4>Loading...</h4>;

  return (
    <>
      <NextSeo
        title="Manage Arsip | Sistem Aplikasi KJRI Frankfurt"
        description="Manage Arsip Sistem Aplikasi KJRI Frankfurt"
      />
      <h3 className="mt-3">Manage Arsip</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label className="form-label">Jenis Arsip</label>
            <input
              className="form-control"
              name="jenisArsip"
              value={values.jenisArsip}
              onChange={handleChange}
            />
            {errors.jenisArsip && touched.jenisArsip && (
              <small className="text-danger">{errors.jenisArsip}</small>
            )}
          </div>

          <div className="col">
            <label className="form-label">Akronim</label>
            <input
              className="form-control"
              name="acronym"
              value={values.acronym}
              onChange={handleChange}
            />

            {errors.acronym && touched.acronym && (
              <small className="text-danger">{errors.acronym}</small>
            )}
          </div>
        </div>

        <button className="btn-dark btn mt-3" type="submit">
          Simpan Arsip
        </button>
      </form>
      <table className="table caption-top mt-3">
        <caption>Table Jenis Arsip</caption>
        <thead>
          <tr>
            <th scope="col">Jenis Arsip</th>
            <th scope="col">Akronim</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((v) => {
            return (
              <tr key={v.jenisArsip}>
                <th scope="row">{v.jenisArsip}</th>
                <td>{v.acronym}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ManageArsip;
