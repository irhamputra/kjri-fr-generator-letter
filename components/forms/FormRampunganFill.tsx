import { Field, FieldArray, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { GeoFill } from "react-bootstrap-icons";
import { object } from "yup";
import StepperDown from "../../components/StepperDown";
import { FormRampunganFillInitialValues } from "../../typings/RampunganFill";
import { createRampungan } from "../../utils/createHelper";
import { DatePickerComponent } from "../CustomField";

export type FormRampunganFillProps = {
  initialValues: FormRampunganFillInitialValues;
  onSave: (val: FormRampunganFillInitialValues) => any;
  onClickBack: () => any;
};

const FormRampunganFill: React.FC<FormRampunganFillProps> = ({
  initialValues = [],
  onSave = (val: any) => val,
  onClickBack,
}) => {
  const validationSchema = object();
  const { push } = useRouter();
  return (
    <Formik
      initialValues={initialValues as any}
      validationSchema={validationSchema}
      // enableReinitialize
      onSubmit={async (val, { setSubmitting }) => {
        setSubmitting(true);
        onSave(val);
        setSubmitting(false);
        await push("/layanan/penugasan/list");
      }}
    >
      {({
        values,
        errors,
        touched,
      }: {
        values: FormRampunganFillInitialValues;
        errors: Record<string, any>;
        touched: Record<string, any>;
      }) => {
        return (
          <>
            <Form>
              <div className="mb-2">
                <label className="form-label" style={{ fontWeight: "bold" }}>
                  Nama Pembuat Komitmen
                </label>

                <Field
                  className="form-control"
                  value={values.pembuatKomitmenName}
                  name="pembuatKomitmenName"
                  placeholder="Masukan nama pembuat komitmen"
                />
                {errors.pergiDari && touched.pergiDari && <small className="text-danger">{errors.pergiDari}</small>}
              </div>
              <div className="mb-4">
                <label className="form-label" style={{ fontWeight: "bold" }}>
                  NIP Pembuat Komitmen
                </label>

                <Field
                  className="form-control"
                  value={values.pembuatKomitmenNIP}
                  name="pembuatKomitmenNIP"
                  placeholder="Masukan NIP pembuat komitmen"
                />
                {errors.pergiDari && touched.pergiDari && <small className="text-danger">{errors.pergiDari}</small>}
              </div>

              <FieldArray
                name="data"
                render={(arrayHelpers) =>
                  values.data.map((_, index) => {
                    const { nama, nip, rampungan } = _;
                    const lastRampungan = rampungan[rampungan.length - 1];
                    return (
                      <>
                        <div className="p-3 mb-3" style={{ borderRadius: 8, border: "1px solid #e2e2e2" }}>
                          <div className="mb-3">
                            <h4>{nama}</h4>
                            <span>NIP : {nip}</span>
                          </div>
                          <FieldArray
                            name={`data[${index}].rampungan`}
                            render={(arrayHelpr) => {
                              return (
                                <>
                                  {rampungan?.map((val, idx) => {
                                    return (
                                      <div>
                                        <StepperDown>
                                          <div className="row mb-3">
                                            <div className="col-sm-4">
                                              <label className="form-label" style={{ fontWeight: "bold" }}>
                                                Berangkat dari{" "}
                                                <span style={{ fontStyle: "italic", fontWeight: "normal" }}>
                                                  (Depart from)
                                                </span>
                                              </label>

                                              <Field
                                                className="form-control"
                                                disabled
                                                value={val.pergiDari}
                                                name={`data[${index}].rampungan[${idx}].pergiDari`}
                                                placeholder="Masukan tempat"
                                              />
                                              {errors.pergiDari && touched.pergiDari && (
                                                <small className="text-danger">{errors.pergiDari}</small>
                                              )}
                                            </div>
                                            <div className="col-sm-4">
                                              <label className="form-label" style={{ fontWeight: "bold" }}>
                                                Tanggal Pergi{" "}
                                                <span style={{ fontStyle: "italic", fontWeight: "normal" }}>
                                                  (Date)
                                                </span>
                                              </label>

                                              <Field
                                                className="form-control"
                                                name={`data[${index}].rampungan[${idx}].tanggalPergi`}
                                                component={DatePickerComponent}
                                                value={val.tanggalPergi}
                                                placeholder="Pilih Surat"
                                              />
                                              {errors.tanggalPergi && touched.tanggalPergi && (
                                                <small className="text-danger">{errors.tanggalPergi}</small>
                                              )}
                                            </div>
                                          </div>
                                        </StepperDown>
                                        <StepperDown Icon={<GeoFill />} isLast>
                                          <div className="row mb-3">
                                            <div className="col-sm-4">
                                              <label className="form-label" style={{ fontWeight: "bold" }}>
                                                Tiba di{" "}
                                                <span style={{ fontStyle: "italic", fontWeight: "normal" }}>
                                                  (Arrive in)
                                                </span>
                                              </label>

                                              <Field
                                                className="form-control"
                                                disabled={idx !== rampungan.length - 1}
                                                name={`data[${index}].rampungan[${idx}].tibaDi`}
                                                value={val.tibaDi}
                                                placeholder="Masukan tempat"
                                              />
                                              {errors.tibaDi && touched.tibaDi && (
                                                <small className="text-danger">{errors.tibaDi}</small>
                                              )}
                                            </div>
                                            <div className="col-sm-4">
                                              <label className="form-label" style={{ fontWeight: "bold" }}>
                                                Tanggal Tiba{" "}
                                                <span style={{ fontStyle: "italic", fontWeight: "normal" }}>
                                                  (Date)
                                                </span>
                                              </label>

                                              <Field
                                                className="form-control"
                                                value={val.tanggalTiba}
                                                component={DatePickerComponent}
                                                name={`data[${index}].rampungan[${idx}].tanggalTiba`}
                                                placeholder="Pilih Surat"
                                              />
                                              {errors.tanggalTiba && touched.tanggalTiba && (
                                                <small className="text-danger">{errors.tanggalTiba}</small>
                                              )}
                                            </div>
                                          </div>
                                        </StepperDown>
                                      </div>
                                    );
                                  })}
                                  <div style={{ marginLeft: 56 }} className="d-flex">
                                    {rampungan.length < 3 && (
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        style={{ marginRight: 16 }}
                                        onClick={() =>
                                          arrayHelpr.push(
                                            createRampungan(lastRampungan.tibaDi, lastRampungan.tanggalTiba)
                                          )
                                        }
                                        disabled={!lastRampungan?.tibaDi}
                                      >
                                        Tambah destinasi
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      className="btn btn-outline-dark"
                                      onClick={() => arrayHelpr.pop()}
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                </>
                              );
                            }}
                          />
                        </div>
                      </>
                    );
                  })
                }
              />
              <div className="mt-3">
                <div className="d-flex justify-content-between">
                  <div className="d-flex">
                    <button onClick={() => onClickBack()} className="btn btn-outline-dark btn" type="button">
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
  );
};

export default FormRampunganFill;
