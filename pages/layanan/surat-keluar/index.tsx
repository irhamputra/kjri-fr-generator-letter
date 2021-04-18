import * as React from "react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../../../utils/validation/schema";
import dayjs from "dayjs";
import { NextSeo } from "next-seo";
import { UncontrolledDropzone } from "../../../components/CustomField";
import { SelectArsip } from "../../../components/Select";
import useCreateSuratKeluarMutation from "../../../hooks/mutation/useCreateSuratKeluarMutation";
import { toast } from "react-hot-toast";
import useQuerySuratKeluar from "../../../hooks/query/useQuerySuratKeluar";
import { useRouter } from "next/router";
import capitalizeFirstLetter from "../../../utils/capitalize";
import useQueryJenisSurat from "../../../hooks/query/useQueryJenisSurat";
import { v4 } from "uuid";
import useUpdateSuratKeluarMutation from "../../../hooks/mutation/useUpdateSuratKeluarMutation";
import { useAuthContext } from "../../../context/AuthContext";

const SuratKeluar: NextPage = () => {
  const [disabled, setDisabled] = React.useState(false);
  const { push } = useRouter();
  const {
    data: { email },
  } = useAuthContext();

  const initialValues = {
    recipient: "",
    surat: [],
    content: "",
    jenisSurat: "",
    nomorSurat: "",
    arsipId: "",
    id: "",
    author: "",
  };

  const { mutateAsync: createSuratKeluar } = useCreateSuratKeluarMutation();
  const { mutateAsync: updateSuratKeluar } = useUpdateSuratKeluarMutation();
  const { data: listSuratKeluar } = useQuerySuratKeluar();
  const { data: listJenisSurat } = useQueryJenisSurat();

  const { values, handleSubmit, handleChange, errors, touched, setFieldValue, isSubmitting, resetForm } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);

      try {
        await updateSuratKeluar(values);
      } catch (e) {
        toast.error("Gagal membuat surat keluar!");
        throw new Error(e.message);
      }

      await push("/layanan/surat-keluar/list");
      resetForm();
      setSubmitting(false);
    },
  });

  const onDrop = (acceptedFiles) => {
    setFieldValue("surat", acceptedFiles);
  };

  const handleNomorSurat = async () => {
    if (!values.arsipId || !values.jenisSurat) return await setFieldValue("nomorSurat", "");

    try {
      const incrementNumber = `00${listSuratKeluar?.total + 1}`;
      const thisMonth = dayjs().month() + 1;
      const thisYear = dayjs().year();

      const labelJenisSurat = listJenisSurat?.find((v) => v.label === values.jenisSurat).label;

      let jenisSurat = "";
      let suffixFRA = false;
      let suratKeputusan = "";

      if (labelJenisSurat === "Surat Pengumuman") {
        jenisSurat = "PEN";
      }

      if (labelJenisSurat === "Surat Keterangan") {
        jenisSurat = "SUKET";
      }

      if (!["Nota Dinas", "Surat Edaran", "Surat Keputusan"].includes(labelJenisSurat)) {
        suffixFRA = true;
      }

      if (labelJenisSurat === "Surat Keputusan") {
        suratKeputusan = "SK-FRA";
      }

      const id = v4();

      const nomorSurat = `${incrementNumber}/${suratKeputusan ? `${suratKeputusan}/` : ""}${
        jenisSurat ? `${jenisSurat}/` : ""
      }${values.arsipId}/${thisMonth}/${thisYear}${suffixFRA ? "/FRA" : ""}`;

      await setFieldValue("id", id);
      await setFieldValue("nomorSurat", nomorSurat);
      await setFieldValue("author", email);

      await createSuratKeluar({ id, author: email, nomorSurat });

      setDisabled(true);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return (
    <div className="mt-3">
      <NextSeo
        title="Surat Keluar | Sistem Aplikasi KJRI Frankfurt"
        description="Surat Keluar Sistem Aplikasi KJRI Frankfurt"
      />
      <h4>Surat Keluar</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-3">
            <label className="form-label">Jenis Surat</label>
            <select
              disabled={disabled}
              className="form-select"
              aria-label="Jenis Surat"
              name="jenisSurat"
              value={values.jenisSurat}
              onChange={handleChange}
              style={{ height: 66 }}
            >
              <option value="">Pilih Jenis Surat</option>
              {listJenisSurat?.map((v) => {
                return (
                  <option key={v.id} value={v.label}>
                    {v.label}
                  </option>
                );
              })}
            </select>
            {errors.jenisSurat && touched.jenisSurat && <small className="text-danger">{errors.jenisSurat}</small>}
          </div>

          <div className="col-3">
            <label className="form-label">Arsip</label>

            <SelectArsip
              placeholder="Pilih Arsip"
              onChange={(v) => {
                setFieldValue("arsipId", v);
              }}
              value={values.arsipId}
              isDisabled={disabled}
            />
            {errors.arsipId && touched.arsipId && <small className="text-danger">{errors.arsipId}</small>}
          </div>

          <div className="col">
            <label className="form-label">Nomor Surat</label>

            <div className="input-group" style={{ height: 66 }}>
              <input
                className="form-control"
                name="nomorSurat"
                value={values.nomorSurat}
                onChange={handleChange}
                disabled
              />
              {values.nomorSurat ? null : (
                <button
                  className="btn btn-dark"
                  disabled={!values.arsipId || !values.jenisSurat}
                  onClick={handleNomorSurat}
                  type="button"
                >
                  Generate Nomor Surat
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col">
            <label className="form-label">Kepada</label>
            <input
              className="form-control"
              value={capitalizeFirstLetter(values.recipient)}
              name="recipient"
              onChange={handleChange}
            />
            {errors.recipient && touched.recipient && <small className="text-danger">{errors.recipient}</small>}
          </div>

          <div className="col">
            <label className="form-label">Isi Surat</label>
            <input
              className="form-control"
              value={capitalizeFirstLetter(values.content)}
              name="content"
              onChange={handleChange}
            />
            {errors.content && touched.content && <small className="text-danger">{errors.content}</small>}
          </div>
        </div>

        <div className="row mt-3">
          <div className="col">
            <label className="form-label">Upload Surat</label>
            <UncontrolledDropzone
              values={(values.surat as unknown) as File[]}
              onDrop={onDrop}
              onClickReset={() => setFieldValue("surat", [])}
            />
            {errors.surat && touched.surat && <small className="text-danger">{errors.surat}</small>}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-dark">
          {isSubmitting ? "Membuat Surat Keluar" : "Simpan Surat"}
        </button>

        <button
          disabled={isSubmitting}
          type="reset"
          onClick={() => {
            setDisabled(false);
            resetForm();
          }}
          className="btn btn-outline-danger mx-3"
        >
          Ulangi
        </button>
      </form>
    </div>
  );
};

export default SuratKeluar;
