import * as React from "react";
import { NextPage } from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import { useFormik } from "formik";
import axios from "axios";
import { object } from "yup";
import createSchema from "../../utils/validation/schema";
import { QueryClient, useQuery } from "react-query";

const query = new QueryClient();

const ManageArsip: NextPage = () => {
  const initialValues = { kelasArsip: "", acronym: "" };

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        await axios.post("/api/v1/arsip", values);
      } catch (e) {
        throw new Error(e.message);
      }

      resetForm();
      setSubmitting(false);
    },
  });

  const { data, isLoading } = useQuery(
    ["fetchArsip", isSubmitting],
    async () => {
      const { data } = await axios.get("/api/v1/arsip");

      return data;
    },
    {
      onSuccess: async () => {
        await query.invalidateQueries("fetchArsip");
      },
    }
  );

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <DashboardLayout>
      <h3 className="mt-3">Manage Arsip</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label className="form-label">Arsip</label>

            <input
              className="form-control"
              onChange={handleChange}
              name="kelasArsip"
              value={values.kelasArsip}
            />
            {errors.kelasArsip && touched.kelasArsip && (
              <small className="text-danger">{errors.kelasArsip}</small>
            )}
          </div>

          <div className="col">
            <label className="form-label">Akronim</label>

            <input
              className="form-control"
              onChange={handleChange}
              name="acronym"
              value={values.acronym}
            />
            {errors.acronym && touched.acronym && (
              <small className="text-danger">{errors.acronym}</small>
            )}
          </div>
        </div>

        <button className="btn-dark btn mt-3" type="submit">
          Submit Arsip Baru
        </button>
      </form>

      <h4 className="mt-3">Data Table Akronim</h4>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Jenis Arsip</th>
            <th scope="col">Akronim</th>
          </tr>
        </thead>
        <tbody>
          {data
            ?.sort((a, b) => a.kelasArsip - b.kelasArsip)
            .map((v) => (
              <tr key={v.acronym}>
                <td scope="row">{v.kelasArsip}</td>
                <td>{v.acronym}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default ManageArsip;
