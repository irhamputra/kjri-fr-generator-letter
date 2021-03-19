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

const generateArchive = () => {
  function convertToRoman(num) {
    const roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };
    let str = "";

    for (let i of Object.keys(roman)) {
      const q = Math.floor(num / roman[i]);
      num -= q * roman[i];
      str += i.repeat(q);
    }

    return str;
  }

  return Array.from({ length: 10 }).map((_, i) => {
    return (
      <option
        key={i + 1}
        value={convertToRoman(i + 1)}
        label={convertToRoman(i + 1)}
      />
    );
  });
};

const SuratTugas: NextPage = () => {
  const initialValues = {
    nomorSurat: "",
    tujuanDinas: "",
    arsipId: "",
  };

  const { replace } = useRouter();

  const {
    handleChange,
    handleSubmit,
    values,
    setFieldValue,
    setFieldError,
    errors,
    touched,
    setFieldTouched,
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
    if (!values.arsipId) {
      await setFieldTouched("arsipId", true);
      return setFieldError("arsipId", "Pilih arsip terlebih dahulu!");
    }

    const { data } = await axios.get("/api/v1/surat-tugas");
    const { total } = data;

    const incrementCount = total + 1;
    const thisMonth = dayjs().month() + 1;
    const thisYear = dayjs().year();

    await setFieldValue(
      "nomorSurat",
      `${incrementCount}/ST/${values.arsipId}/${thisMonth}/${thisYear}/FRA`
    );
  };

  return (
    <DashboardLayout>
      <h1>Surat Tugas (SPD)</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label className="form-label">Nomor Surat Arsip</label>

          <div className="col">
            <select
              onChange={handleChange}
              name="arsipId"
              className="form-select"
              id="records"
              value={values.arsipId}
            >
              <option value="" label="Pilih Jenis Arsip" />
              {generateArchive()}
            </select>
            {errors.arsipId && touched.arsipId && (
              <small className="text-danger">{errors.arsipId}</small>
            )}
          </div>
          <div className="col">
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
          <div className="col">
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
