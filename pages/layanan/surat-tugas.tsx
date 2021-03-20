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
import { useQuery } from "react-query";
import Link from "next/link";

const SuratTugas: NextPage = () => {
  const initialValues = {
    nomorSurat: "",
    tujuanDinas: "",
    arsipId: "",
  };

  const { replace } = useRouter();

  const { data } = useQuery("fetchArsip", async () => {
    const { data } = await axios.get("/api/v1/arsip");
    return data;
  });

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
      `${incrementCount}/SPPD/${values.arsipId}/${thisMonth}/${thisYear}/FRA`
    );
  };

  return (
    <DashboardLayout>
      <h3 className="mt-3">Surat Tugas (SPPD)</h3>
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
              {data
                ?.sort((a, b) => a.kelasArsip - b.kelasArsip)
                .map((v) => (
                  <option key={v.acronym} value={v.acronym} label={v.acronym} />
                ))}
            </select>
            {errors.arsipId && touched.arsipId && (
              <small className="text-danger">{errors.arsipId}</small>
            )}

            <Link href="/pengaturan/manage-arsip">
              <div>
                <small className="text-primary" style={{ cursor: "pointer" }}>
                  Manage Arsip
                </small>
              </div>
            </Link>
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
