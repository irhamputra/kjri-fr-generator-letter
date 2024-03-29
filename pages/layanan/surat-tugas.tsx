import * as React from "react";
import { NextPage } from "next";
import { useFormik, FormikProvider, Field } from "formik";
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
import RichTextField from "../../components/rich-text-field/RichTextField";
import useWarnUnsavedChange from "../../hooks/useWarnUnsavedChange";
import { DatePickerComponent } from "../../components/CustomField";
import { CreateSuratTugasReqBody, CreateSuratTugasValues } from "../../typings/SuratTugas";

const SuratTugas: NextPage = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  const { data, isLoading } = useMyQuery(
    "fetchListSuratTugas",
    async () => {
      const { data } = await axios.get("/api/v1/surat-tugas");

      return data;
    },
    {
      enabled: true,
    }
  );

  const [hint, setHint] = React.useState(-1);

  const hintList = ["/images/e1.png", "/images/e2.png", "/images/e3.png"];

  const initialValues: CreateSuratTugasValues & { konjen: string } = {
    nomorSurat: "",
    tujuanDinas: "",
    konjen: "",
    createdAt: new Date(),
    textPembuka: [
      {
        children: [{ text: "" }],
      },
    ],
    textTengah: [
      {
        children: [{ text: "" }],
      },
    ],
    textPenutup: [
      {
        children: [{ text: "" }],
      },
    ],
  };

  const { replace } = useRouter();

  const {
    handleChange,
    handleSubmit,
    values,
    setFieldValue,
    errors,
    touched,
    resetForm,
    isSubmitting,
    dirty,
    ...restFormik
  } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const postJson: CreateSuratTugasReqBody = {
          ...values,
          suratTugasId: v4(),
        };
        await axios.post("/api/v1/surat-tugas", postJson);
        toast.success("Surat Tugas berhasil dibuat");
      } catch (e) {
        toast.error("Terjadi masalah teknis");
        throw new Error(e.message);
      }

      setSubmitting(false);
      finishEditing();
    },
  });

  const { finishEditing } = useWarnUnsavedChange(dirty, async () => {
    await replace("/layanan/penugasan");
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
      <div className="d-flex">
        <div style={{ flex: 1 }}>
          <h4>Surat Tugas (ST)</h4>
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
              dirty,
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
                    {errors.nomorSurat && touched.nomorSurat && (
                      <small className="text-danger">{errors.nomorSurat}</small>
                    )}
                  </div>

                  {values.nomorSurat ? null : (
                    <div className="col-4">
                      <button type="button" onClick={onCounterId} className="btn btn-dark">
                        Generate Nomor Surat
                      </button>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="mt-3 col-8">
                    <label className="form-label">Nama Dinas / Perihal Dinas</label>
                    <input
                      disabled={isSubmitting}
                      className="form-control"
                      name="tujuanDinas"
                      onChange={handleChange}
                      onFocus={() => setHint(-1)}
                      value={values.tujuanDinas}
                    />
                    {errors.tujuanDinas && touched.tujuanDinas && (
                      <small className="text-danger">{errors.tujuanDinas}</small>
                    )}
                  </div>
                  <div className="mt-3 col-4">
                    <label className="form-label">Tanggal dibuat</label>

                    <Field
                      className="form-control"
                      name={`createdAt`}
                      component={DatePickerComponent}
                      value={values.createdAt}
                    />
                    {errors.createdAt && touched.createdAt && <small className="text-danger">{errors.createdAt}</small>}
                  </div>
                  <div className="mt-3">
                    <label className="form-label">Text pembuka</label>
                    <RichTextField
                      onFocus={() => setHint(0)}
                      onChange={(value) => {
                        setFieldValue("textPembuka", value);
                      }}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label">Text tengah</label>
                  <RichTextField
                    onFocus={() => setHint(1)}
                    onChange={(value) => {
                      setFieldValue("textTengah", value);
                    }}
                  />
                </div>

                <div className="mt-3">
                  <label className="form-label">Text penutup</label>
                  <RichTextField
                    onFocus={() => setHint(2)}
                    onChange={(value) => {
                      setFieldValue("textPenutup", value);
                    }}
                  />
                </div>

                <div className="mt-3">
                  <label className="form-label">Nama Konjen</label>
                  <input
                    disabled={isSubmitting}
                    className="form-control"
                    name="konjen"
                    onChange={handleChange}
                    onFocus={() => setHint(-1)}
                    value={values.konjen}
                  />
                  {errors.konjen && touched.konjen && <small className="text-danger">{errors.konjen}</small>}
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
        </div>
        <div
          style={{
            flex: 1,
            paddingRight: 64,
            paddingLeft: 64,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {hint !== -1 && <img width="100%" height="100%" loading="lazy" src={hintList[hint]} />}
        </div>
      </div>
    </section>
  );
};

export default SuratTugas;
