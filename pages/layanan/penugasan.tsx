import * as React from "react";
import { NextPage } from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import { Form, FieldArray, Field, Formik } from "formik";
import axios from "axios";
import { useQuery } from "react-query";
import CustomField from "../../components/CustomField";

const Penugasan: NextPage = () => {
  const { data } = useQuery("fetchSuratTugas", async () => {
    const { data } = await axios.get("/api/v1/penugasan");

    return data;
  });

  const initialValues = {
    namaPegawai: [{ nama: "", golongan: "", jabatan: "", durasi: "" }],
    nomorSurat: "",
  };

  return (
    <DashboardLayout>
      <h3 className="mt-3">Surat Penugasan Perjalanan Dinas (SPD)</h3>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            await axios.put("/api/v1/penugasan", values);

            setSubmitting(false);
          }}
        >
          {({ values, errors }) => (
            <Form>
              <label className="form-label">Nomor Surat</label>

              <Field as="select" className="form-select" name="nomorSurat">
                <option value="" label="Pilih Nomor Surat" />
                {data &&
                  data.map(({ nomorSurat, tujuanDinas }) => (
                    <option
                      key={nomorSurat}
                      value={nomorSurat}
                      label={`${nomorSurat} - ${tujuanDinas}`}
                    />
                  ))}
              </Field>

              <FieldArray
                name="namaPegawai"
                render={(arrayHelpers) => (
                  <div className="mt-3">
                    {values.namaPegawai && values.namaPegawai.length > 0 ? (
                      values.namaPegawai.map((_, index) => (
                        <div key={index} className="mt-3 row">
                          <div className="col">
                            <div className="row">
                              <div className="col">
                                <label className="form-label">Nama Staff</label>
                                <Field
                                  className="form-control"
                                  name={`namaPegawai.${index}.nama`}
                                />
                              </div>

                              <div className="col">
                                <label className="form-label">
                                  Pangkat/Golongan
                                </label>
                                <Field
                                  className="form-control"
                                  name={`namaPegawai.${index}.golongan`}
                                />
                              </div>

                              <div className="col">
                                <label className="form-label">Jabatan</label>
                                <Field
                                  className="form-control"
                                  name={`namaPegawai.${index}.jabatan`}
                                />
                              </div>

                              <div className="col">
                                <label className="form-label">
                                  Lama Perjalanan
                                </label>
                                <Field
                                  className="form-control"
                                  name={`namaPegawai.${index}.durasi`}
                                  as={CustomField}
                                  placeholder="(e.g 1 hari atau 2,5 hari)"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-1 d-flex align-items-end">
                            <button
                              className="btn btn-outline-danger w-100"
                              type="button"
                              onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                            >
                              Hapus
                            </button>
                          </div>

                          <div className="col-1 d-flex align-items-end">
                            <button
                              className="btn btn-info text-white w-100"
                              type="button"
                              onClick={() =>
                                arrayHelpers.insert(index, {
                                  nama: "",
                                  golongan: "",
                                  jabatan: "",
                                  durasi: "",
                                })
                              }
                            >
                              Tambah
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <button
                        className="btn btn-dark"
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({
                            nama: "",
                            golongan: "",
                            jabatan: "",
                            durasi: "",
                          })
                        }
                      >
                        Tambahkan Pegawai
                      </button>
                    )}

                    <div className="mt-3">
                      <button className="btn btn-dark" type="submit">
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              />
            </Form>
          )}
        </Formik>
      </div>
    </DashboardLayout>
  );
};

export default Penugasan;
