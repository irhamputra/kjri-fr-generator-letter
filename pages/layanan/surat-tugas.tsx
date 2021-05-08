import * as React from "react";
import { GetServerSideProps, NextPage } from "next";
import { useFormik } from "formik";
import { object } from "yup";
import axios from "axios";
import dayjs from "dayjs";
import createSchema from "../../utils/validation/schema";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { NextSeo } from "next-seo";
import { v4 } from "uuid";
import apiInstance from "../../utils/firebase/apiInstance";
import parseCookies from "../../utils/parseCookies";
import { Auth } from "../../typings/AuthQueryClient";
import { useMyQuery } from "../../hooks/useMyQuery";

const SuratTugas: NextPage = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  const { data, isLoading } = useMyQuery(
    "fetchSuratTugas",
    async () => {
      const { data } = await axios.get("/api/v1/surat-tugas");

      return data;
    },
    {
      enabled: true,
    }
  );

  const initialValues = {
    nomorSurat: "",
    tujuanDinas: "",
  };

  const { replace } = useRouter();

  const { handleChange, handleSubmit, values, setFieldValue, errors, touched, resetForm, isSubmitting } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await axios.post("/api/v1/surat-tugas", {
          suratTugasId: v4(),
          ...values,
        });
        toast.success("Surat Tugas berhasil dibuat");
      } catch (e) {
        toast.error("Terjadi masalah teknis");
        throw new Error(e.message);
      }

      await replace("/layanan/penugasan");

      setSubmitting(false);
    },
  });

  if (isLoading) return <h4>Loading...</h4>;

  if (!query?.isAdmin) throw new Error("Invalid permission");

  const onCounterId = async (): Promise<void> => {
    const incrementCount = data.total + 1;
    const thisMonth = dayjs().month() + 1;
    const thisYear = dayjs().year();

    await setFieldValue("nomorSurat", `${incrementCount}/SPPD/${thisMonth}/${thisYear}/FRA`);
  };

  return (
    <section className="mt-3">
      <NextSeo
        title="Surat Tugas | Sistem Aplikasi KJRI Frankfurt"
        description="Surat Tugas Sistem Aplikasi KJRI Frankfurt"
      />
      <h4>Surat Tugas (SPPD)</h4>
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
            {errors.nomorSurat && touched.nomorSurat && <small className="text-danger">{errors.nomorSurat}</small>}
          </div>

          {values.nomorSurat ? null : (
            <div className="col-3">
              <button type="button" onClick={onCounterId} className="btn btn-dark">
                Generate Nomor Surat
              </button>
            </div>
          )}
        </div>

        <div className="mt-3">
          <label className="form-label">Nama Dinas / Tujuan Dinas</label>
          <input
            disabled={isSubmitting}
            className="form-control"
            name="tujuanDinas"
            onChange={handleChange}
            value={values.tujuanDinas}
          />
          {errors.tujuanDinas && touched.tujuanDinas && <small className="text-danger">{errors.tujuanDinas}</small>}
        </div>

        <div className="mt-3">
          <button disabled={isSubmitting} className="btn btn-dark " type="submit">
            Simpan Surat
          </button>

          <button className="btn btn-outline-danger mx-3" onClick={() => resetForm()} type="reset">
            Ulangi
          </button>
        </div>
      </form>
    </section>
  );
};

export default SuratTugas;
