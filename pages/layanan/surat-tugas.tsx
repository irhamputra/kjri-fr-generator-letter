import * as React from "react";
import { GetServerSideProps, NextPage } from "next";
import { useFormik, Field, FormikProvider } from "formik";
import { object } from "yup";
import axios from "axios";
import dayjs from "dayjs";
import createSchema from "../../utils/validation/schema";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { NextSeo } from "next-seo";
import { v4 } from "uuid";
import { Auth } from "../../typings/AuthQueryClient";
import { useMyQuery } from "../../hooks/useMyQuery";
import RichTextExample from "../../components/rich-text-field/RichTextField";

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
    textPembuka: [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
    textTengah: [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
    textPenutup: [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
  };

  const { replace } = useRouter();

  const { handleChange, handleSubmit, values, setFieldValue, errors, touched, resetForm, isSubmitting, ...restFormik } =
    useFormik({
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
    <section style={{ marginTop: "6rem" }}>
      <NextSeo
        title="Surat Tugas | Sistem Aplikasi KJRI Frankfurt"
        description="Surat Tugas Sistem Aplikasi KJRI Frankfurt"
      />
      <h4>Surat Tugas (SPPD)</h4>
      <FormikProvider
        value={{
          handleChange,
          handleSubmit,
          values,
          setFieldValue,
          errors,
          touched,
          resetForm,
          isSubmitting,
          ...restFormik,
        }}
      >
        <div className="mb-5" style={{ maxWidth: 640 }}>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <label className="form-label">Nomor Surat Arsip</label>
              <div className="col-4">
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
                <div className="col-4">
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
              <label className="form-label">Text pembuka</label>
              <RichTextExample
                name="textPembuka"
                onChange={(value) => setFieldValue("textPembuka", value)}
                value={values.textPembuka}
              />
            </div>

            <div className="mt-3">
              <label className="form-label">Text tengah</label>
              <RichTextExample
                name="textTengah"
                onChange={(value) => setFieldValue("textTengah", value)}
                value={values.textTengah}
              />
            </div>

            <div className="mt-3">
              <label className="form-label">Text penutup</label>
              <RichTextExample
                name="textPenutup"
                onChange={(value) => setFieldValue("textPenutup", value)}
                value={values.textPenutup}
              />
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
        </div>
      </FormikProvider>
    </section>
  );
};

export default SuratTugas;
