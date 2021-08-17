import { Field, FieldArray, Form, Formik, getIn } from "formik";
import React, { useState } from "react";
import { ArrowRight, GeoFill } from "react-bootstrap-icons";
import { object } from "yup";

export type FormKeteranganValues = {
  data: {
    nama: string;
    nip: string;
    rincian: string;
  }[];
};

export type FormKeteranganProps = {
  initialValues: FormKeteranganValues;
  onSave: (val: FormKeteranganValues) => any;
  onClickBack: () => any;
};

type FormRender = {
  values: FormKeteranganValues;
  errors: Record<string, any>;
  touched: Record<string, any>;
};

const FormKeterangan: React.FC<FormKeteranganProps> = ({
  initialValues = { data: [] },
  onSave = (val: any) => val,
  onClickBack,
}) => {
  const validationSchema = object();

  return (
    <div>
      <h4 className="mb-4">Keterangan Tambahan (Opsional) </h4>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        // enableReinitialize
        onSubmit={async (val, { setSubmitting }) => {
          setSubmitting(true);
          onSave(val);
          setSubmitting(false);
        }}
      >
        {({ values, errors, touched }: FormRender) => {
          return (
            <>
              <Form>
                <div>
                  {values.data.map(({ rincian, nama, nip }, index) => (
                    <div className="p-3 mb-3" style={{ borderRadius: 8, border: "1px solid #e2e2e2" }}>
                      <div className="mb-3">
                        <h4>{nama}</h4>
                        <span>NIP : {nip}</span>
                      </div>
                      <div className="mb-2">
                        <label className="form-label" style={{ fontWeight: "bold" }}>
                          Keterangan Rincian Biaya Perjalanan Dinas
                        </label>

                        <Field
                          className="form-control"
                          value={rincian}
                          name={`data[${index}].rincian`}
                          placeholder="Keterangan"
                        />
                        {getIn(errors, `data[${index}].rincian`) && getIn(touched, `data[${index}].rincian`) && (
                          <small className="text-danger">{getIn(errors, `data[${index}].rincian`)}</small>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex">
                      <button onClick={() => onClickBack()} className="btn btn-outline-dark ms-2 btn" type="button">
                        Kembali ke list
                      </button>
                    </div>
                    <button className="btn btn-dark btn" type="submit">
                      Simpan Surat
                    </button>
                  </div>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormKeterangan;
