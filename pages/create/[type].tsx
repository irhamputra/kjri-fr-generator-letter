import * as React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { v4 } from "uuid";
import useValidation from "../../hooks/useValidation";
import DashboardLayout from "../../components/layout/Dashboard";

const LetterType: NextPage = () => {
  const [disabled, setDisabled] = React.useState(false);
  const { query } = useRouter();

  const initialValues = {
    referenceNumber: "",
    recipient: "",
    subject: "",
    records: "",
  };

  const validationSchema = useValidation(initialValues);

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    isSubmitting,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      console.log({ values });

      setSubmitting(false);
    },
  });

  const handleGenerateReferenceNumber = () => {
    setValues({
      recipient: "",
      records: "",
      subject: "",
      referenceNumber: v4(),
    });

    setDisabled(true);
  };

  return (
    <DashboardLayout>
      <h1>{query.type}</h1>
      <p>Layanan pembuatan nomer untuk {query.type}</p>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-4">
            <input
              className="form-control"
              value={values.referenceNumber}
              onChange={handleChange}
              name="referenceNumber"
              id="referenceNumber"
              disabled
            />
          </div>

          <div className="col">
            <button
              className="btn btn-secondary"
              disabled={disabled}
              type="button"
              onClick={handleGenerateReferenceNumber}
            >
              Generate Nomor {query.type}
            </button>
          </div>
          {errors.referenceNumber && touched.referenceNumber && (
            <small className="text-danger">{errors.referenceNumber}</small>
          )}

          <div className="mt-3">
            <label htmlFor="records" className="form-label">
              Arsip
            </label>
            <select
              onChange={handleChange}
              name="records"
              className="form-select w-25"
              id="records"
              value={values.records}
            >
              <option value="" label="Pilih Jenis Arsip" />
              <option value="1" label="Satu" />
              <option value="2" label="Dua" />
              <option value="3" label="Tiga" />
            </select>
            {errors.records && touched.records && (
              <small className="text-danger">{errors.records}</small>
            )}
          </div>

          <div className="my-3">
            <label htmlFor="recipient" className="form-label">
              Kepada
            </label>
            <input
              className="form-control w-25"
              name="recipient"
              onChange={handleChange}
              value={values.recipient}
              disabled={isSubmitting}
              id="recipient"
            />
            {errors.recipient && touched.recipient && (
              <small className="text-danger">{errors.recipient}</small>
            )}
          </div>

          <div>
            <label htmlFor="recipient" className="form-label">
              Isi Surat
            </label>
            <input
              className="form-control w-25"
              name="subject"
              onChange={handleChange}
              value={values.subject}
              disabled={isSubmitting}
              id="subject"
            />
            {errors.subject && touched.subject && (
              <small className="text-danger">{errors.subject}</small>
            )}
          </div>
        </div>

        <button className="btn btn-dark mt-3" type="submit">
          Submit Nomor {query.type}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default LetterType;
