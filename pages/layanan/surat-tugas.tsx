import * as React from "react";
import { NextPage } from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import { useFormik } from "formik";
import { object } from "yup";
import axios from "axios";
import dayjs from "dayjs";
import createSchema from "../../utils/validation/schema";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const SuratTugas: NextPage = () => {
  const initialValues = {
    nomorSurat: "",
    tujuanDinas: "",
  };

  const { replace } = useRouter();

  const {
    handleChange,
    handleSubmit,
    values,
    setFieldValue,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await axios.post("/api/v1/surat-tugas", values);
        toast.success("Surat Tugas berhasil dibuat");
      } catch (e) {
        toast.error("Terjadi masalah teknis");
        throw new Error(e.message);
      }

      await replace("/layanan/penugasan");

      setSubmitting(false);
    },
  });

  const onCounterId = async (): Promise<void> => {
    const { data } = await axios.get("/api/v1/surat-tugas");

    const incrementCount = data.total + 1;
    const thisMonth = dayjs().month() + 1;
    const thisYear = dayjs().year();

    await setFieldValue(
      "nomorSurat",
      `${incrementCount}/SPPD/${thisMonth}/${thisYear}/FRA`
    );
  };

  return (
    <DashboardLayout>
      <h3 className="mt-3">Surat Tugas (SPPD)</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label className="form-label">Nomor Surat Arsip</label>
          <div className="col-3">
            <input
              className="form-control"
              name="nomorSurat"
              onChange={handleChange}
              value={values.nomorSurat}
              disabled
            />
            {errors.nomorSurat && touched.nomorSurat && (
              <small className="text-danger">{errors.nomorSurat}</small>
            )}
          </div>
          <div className="col-3">
            <button
              type="button"
              onClick={onCounterId}
              className="btn btn-dark"
            >
              Generate Nomor Surat
            </button>
          </div>
        </div>

        <div className="mt-3">
          <label className="form-label">Nama Dinas / Tujuan Dinas</label>
          <input
            className="form-control"
            name="tujuanDinas"
            onChange={handleChange}
            value={values.tujuanDinas}
          />
          {errors.tujuanDinas && touched.tujuanDinas && (
            <small className="text-danger">{errors.tujuanDinas}</small>
          )}
        </div>

        <button className="btn btn-dark mt-3" type="submit">
          Submit
        </button>
      </form>
    </DashboardLayout>
  );
};

export default SuratTugas;
