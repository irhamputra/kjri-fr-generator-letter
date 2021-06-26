import React from "react";
import { SelectArsip } from "../Select";
import { useQuerySuratKeluarById } from "../../hooks/query/useQuerySuratKeluar";
import capitalizeFirstLetter from "../../utils/capitalize";
import useQueryJenisSurat from "../../hooks/query/useQueryJenisSurat";
import useSuratKeluarForm from "../../hooks/form/useSuratKeluarForm";
import { useQueryClient } from "react-query";
import { Auth } from "../../typings/AuthQueryClient";
import { useRouter } from "next/router";

const SuratKeluarForm: React.FC<{ editId?: string; backUrl?: string }> = ({ editId, backUrl }) => {
  const [disabled, setDisabled] = React.useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const query = queryClient.getQueryData<Auth>("auth");
  const { data = {}, isLoading } = useQuerySuratKeluarById(router.query.id as string);
  const { data: dataSuratKeluar = {} } = useQuerySuratKeluarById(editId as string);
  const { data: listJenisSurat } = useQueryJenisSurat();

  const { recipient, content, jenisSurat, nomorSurat, arsipId, id, author } = dataSuratKeluar;

  const initialValues = {
    recipient: recipient ?? "",
    content: content ?? "",
    jenisSurat: jenisSurat ?? "",
    nomorSurat: nomorSurat ?? "",
    arsipId: arsipId ?? "",
    id: id ?? "",
    author: author ?? query?.email,
  };

  const {
    values,
    handleSubmit,
    handleChange,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
    resetForm,
    handleNomorSurat,
    disableGenerateNomor,
  } = useSuratKeluarForm(initialValues, backUrl as string);

  const onChangeEditArsip = (arsipValue: string) => {
    const [generatedNumber, value, ...restValues] = nomorSurat.split("/").filter((value: string) => value.length !== 2);

    const hasPrefix = value.includes("SK-FRA") || value.includes("SUKET");
    let generateEditedNomorSurat: string;

    if (!hasPrefix) {
      generateEditedNomorSurat = [generatedNumber, arsipValue, value, ...restValues].join("/");
    } else {
      generateEditedNomorSurat = [generatedNumber, value, arsipValue, ...restValues].join("/");
    }

    setFieldValue("arsipId", arsipValue);
    setFieldValue("nomorSurat", generateEditedNomorSurat);
  };

  if (isLoading) return <h4>Loading...</h4>;

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
              onChange={(v: string) => setFieldValue("arsipId", v)}
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
                  disabled={disableGenerateNomor}
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

      <div className="row">
        {editId && (
          <div className="col-12 mb-3">
            <h3>Edit Nomor Surat</h3>
            <p>{data.nomorSurat}</p>

            <label className="form-label">Arsip</label>
            <SelectArsip
              placeholder="Pilih Arsip"
              onChange={onChangeEditArsip}
              value={values.arsipId}
              isDisabled={disabled}
            />
          </div>
        )}

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
