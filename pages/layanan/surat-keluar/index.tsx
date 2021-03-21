import * as React from "react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../../../utils/validation/schema";
import useQueryArsip from "../../../hooks/query/useQueryArsip";
import axios from "axios";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { NextSeo } from "next-seo";

const listJenisSurat = [
  {
    id: 2983748,
    label: "Surat Biasa",
    value: "1",
  },
  {
    id: 234235235,
    label: "Surat Pengumuman",
    value: "2",
  },
  {
    id: 4576457,
    label: "Surat Pengantar",
    value: "3",
  },
  {
    id: 3463463463,
    label: "Surat Keterangan",
    value: "4",
  },
];

const Index: NextPage = () => {
  const [disabled, setDisabled] = React.useState(false);

  const initialValues = {
    recipient: "",
    content: "",
    jenisSurat: "",
    nomorSurat: "",
    arsipId: "",
  };

  const {
    values,
    handleSubmit,
    handleChange,
    errors,
    touched,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: (values) => console.log(values),
  });

  const { data } = useQueryArsip();

  const { data: suratTugas } = useQuery("fetchSuratKeluar", async () => {
    try {
      const { data } = await axios.get("/api/v1/surat-keluar");

      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  });

  const handleNomorSurat = async () => {
    if (!values.arsipId || !values.jenisSurat)
      return await setFieldValue("nomorSurat", "");

    try {
      const incrementNumber = suratTugas?.total + 1;
      const thisMonth = dayjs().month() + 1;
      const thisYear = dayjs().year();

      let jenisSurat = "";

      if (values.jenisSurat === "2") {
        jenisSurat = "PEN";
      }
      if (values.jenisSurat === "4") {
        jenisSurat = "KET";
      }

      await setFieldValue(
        "nomorSurat",
        `${incrementNumber}/${jenisSurat ? `${jenisSurat}/` : ""}${
          values.arsipId
        }/${thisMonth}/${thisYear}`
      );
      setDisabled(true);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return (
    <>
      <NextSeo
        title="Surat Keluar | Sistem Aplikasi KJRI Frankfurt"
        description="Surat Keluar Sistem Aplikasi KJRI Frankfurt"
      />
      <h3 className="mt-3">Surat Keluar</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-3">
            <select
              disabled={disabled}
              className="form-select"
              aria-label="Jenis Surat"
              name="jenisSurat"
              value={values.jenisSurat}
              onChange={handleChange}
            >
              <option value="">Pilih Jenis Surat</option>
              {listJenisSurat.map((v) => {
                return (
                  <option key={v.id} value={v.value}>
                    {v.label}
                  </option>
                );
              })}
            </select>
            {errors.jenisSurat && touched.jenisSurat && (
              <small className="text-danger">{errors.jenisSurat}</small>
            )}
          </div>
        </div>

        <div className="row my-3">
          <label className="form-label">Nomor Surat</label>
          <div className="col-3">
            <select
              disabled={disabled}
              className="form-select"
              aria-label="Default select example"
              name="arsipId"
              value={values.arsipId}
              onChange={handleChange}
            >
              <option value="">Pilih Arsip</option>
              {data
                ?.sort((a, b) => a.jenisArsip - b.jenisArsip)
                .map((v) => {
                  return (
                    <option key={v.jenisArsip} value={v.acronym}>
                      {v.acronym}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="col-3">
            <input
              className="form-control"
              name="nomorSurat"
              value={values.nomorSurat}
              onChange={handleChange}
              disabled
            />
          </div>

          {values.nomorSurat ? null : (
            <div className="col-3">
              <button
                className="btn btn-dark"
                onClick={handleNomorSurat}
                type="button"
              >
                Generate Surat Nomer
              </button>
            </div>
          )}
        </div>

        <div className="row">
          <div className="col">
            <label className="form-label">Kepada</label>
            <input
              className="form-control"
              value={values.recipient}
              name="recipient"
              onChange={handleChange}
            />
            {errors.recipient && touched.recipient && (
              <small className="text-danger">{errors.recipient}</small>
            )}
          </div>

          <div className="col">
            <label className="form-label">Isi Surat</label>
            <input
              className="form-control"
              value={values.content}
              name="content"
              onChange={handleChange}
            />
            {errors.content && touched.content && (
              <small className="text-danger">{errors.content}</small>
            )}
          </div>
        </div>

        <div className="mt-3">
          <button type="submit" className="btn btn-dark">
            Simpan Surat
          </button>

          <button
            type="reset"
            onClick={() => {
              setDisabled(false);
              resetForm();
            }}
            className="btn btn-outline-danger mx-3"
          >
            Ulangi
          </button>
        </div>
      </form>
    </>
  );
};

export default Index;
