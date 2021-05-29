import { useFormik } from "formik";
import { object } from "yup";
import { useQueryClient } from "react-query";

import React from "react";
import { v4 } from "uuid";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { SelectArsip } from "../Select";
import { useQuerySuratKeluarById } from "../../hooks/query/useQuerySuratKeluar";
import useCreateSuratKeluarMutation from "../../hooks/mutation/useCreateSuratKeluarMutation";
import capitalizeFirstLetter from "../../utils/capitalize";
import useQueryJenisSurat from "../../hooks/query/useQueryJenisSurat";
import createSchema from "../../utils/validation/schema";
import useUpdateSuratKeluarMutation from "../../hooks/mutation/useUpdateSuratKeluarMutation";
import { Auth } from "../../typings/AuthQueryClient";

const SuratKeluarForm: React.FC<{ editId?: string; backUrl?: string }> = ({ editId, backUrl }) => {
  const [disabled, setDisabled] = React.useState(false);
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  const { data: dataSuratKeluar = {} } = useQuerySuratKeluarById(editId as string);
  const { recipient, content, jenisSurat, nomorSurat, arsipId, id, author } = dataSuratKeluar;
  const initialValues = {
    recipient: recipient ?? "",
    content: content ?? "",
    jenisSurat: jenisSurat ?? "",
    nomorSurat: nomorSurat ?? "",
    arsipId: arsipId ?? "",
    id: id ?? "",
    author: author ?? "",
  };

  const { mutateAsync: createSuratKeluar } = useCreateSuratKeluarMutation({
    onMutate: async ({ nomorSurat, id }) => {
      setDisabled(true);
      await setFieldValue("id", id);
      await setFieldValue("nomorSurat", nomorSurat);
      await setFieldValue("author", query?.email);
    },
    onError: async () => {
      await setFieldValue("id", "");
      await setFieldValue("nomorSurat", "");
      await setFieldValue("author", "");
      setDisabled(false);
    },
    onSuccess: async (val) => {
      const { data } = val;
      setFieldValue("nomorSurat", data.nomorSurat);
    },
  });
  const { mutateAsync: updateSuratKeluar } = useUpdateSuratKeluarMutation();
  const { data: listJenisSurat } = useQueryJenisSurat();

  const { values, handleSubmit, handleChange, errors, touched, setFieldValue, isSubmitting, resetForm } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);

      try {
        await updateSuratKeluar(values);
        await queryClient.invalidateQueries(["fetchSuratKeluarId", id]);
      } catch (e) {
        toast.error("Gagal membuat surat keluar!");
        throw new Error(e.message);
      }

      await push(backUrl ?? "/layanan/surat-keluar/list");
      resetForm();
      setSubmitting(false);
    },
  });

  const handleNomorSurat = async () => {
    const { arsipId, jenisSurat } = values;

    if (!arsipId || !jenisSurat) return await setFieldValue("nomorSurat", "");

    try {
      const id = v4();

      await createSuratKeluar({ id, author: query?.email as string, jenisSurat, arsipId });
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!editId && (
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
              {listJenisSurat?.map((v: { id: string; label: string }) => {
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
              onChange={(v: string) => {
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
      )}

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

        <div className="col mb-3">
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

      <button type="submit" disabled={isSubmitting} className="btn btn-dark">
        {isSubmitting ? "Membuat Surat Keluar" : editId ? "Edit Surat" : "Simpan Surat"}
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
  );
};

export default SuratKeluarForm;
