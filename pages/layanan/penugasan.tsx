import * as React from "react";
import { NextPage } from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import { Form, FieldArray, Field, Formik } from "formik";
import axios from "axios";
import { useQuery } from "react-query";

const Penugasan: NextPage = () => {
  const { data } = useQuery("fetchSuratTugas", async () => {
    const { data } = await axios.get("/api/v1/penugasan");

    return data;
  });

  return (
    <DashboardLayout>
      <h1 className="mt-3">Surat Penugasan Perjalanan Dinas (SPD)</h1>
      <div>
        <Formik
          initialValues={{ namaPegawai: [{}], nomorSurat: "" }}
          onSubmit={(values) => console.log(values)}
        >
          {({ values }) => (
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
                      values.namaPegawai.map((friend, index) => (
                        <div key={index} className="mt-3 row">
                          <div className="col">
                            <div className="row">
                              <div className="col">
                                <label className="form-label">Nama / NIP</label>
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
                                  Tanggal Tugas
                                </label>
                                <Field
                                  className="form-control"
                                  name={`namaPegawai.${index}.tanggalTugas`}
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
                              onClick={() => arrayHelpers.insert(index, {})}
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
                        onClick={() => arrayHelpers.push({})}
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
