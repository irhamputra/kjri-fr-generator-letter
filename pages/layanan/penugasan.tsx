import * as React from "react";
import { NextPage } from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import { Form, FieldArray, Field, Formik } from "formik";
import axios, { AxiosResponse } from "axios";
import { InputComponent, SelectComponent } from "../../components/CustomField";
import useQueryJalDir from "../../hooks/useQueryJalDir";
import useQuerySuratTugas from "../../hooks/useQuerySuratTugas";
import { object, string } from "yup";
import { toast } from "react-hot-toast";

const Penugasan: NextPage = () => {
  const { data: listSuratTugas } = useQuerySuratTugas();
  const { data: listJalDir } = useQueryJalDir();

  const initialValues = {
    namaPegawai: [],
    nomorSurat: "",
  };

  const optionsGolongan = listJalDir?.map((v) => ({
    label: v.golongan,
    value: v.golongan,
  }));

  const optionsSuratTugas = listSuratTugas?.map((v) => ({
    label: `${v.nomorSurat} - ${v.tujuanDinas}`,
    value: v.nomorSurat,
  }));

  const validationSchema = object().shape({
    nomorSurat: string().trim().required("Nomor Surat Wajib diisi!"),
  });

  return (
    <DashboardLayout>
      <h3 className="mt-3">Surat Penugasan Perjalanan Dinas (SPD)</h3>
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            let response: AxiosResponse;
            try {
              response = await axios.put("/api/v1/penugasan", values);
              toast.success("SPD berhasil disimpan");
            } catch (e) {
              console.log(response);
              toast.error(e.message);
            }

            setSubmitting(false);
          }}
        >
          {({ values }) => (
            <Form>
              <label className="form-label">Nomor Surat</label>

              <Field
                className="form-control"
                name="nomorSurat"
                component={SelectComponent}
                options={optionsSuratTugas}
                placeholder="Pilih Surat"
              />

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
                                  placeholder="Input nama pegawai"
                                />
                              </div>

                              <div className="col">
                                <label className="form-label">
                                  Golongan Jalan Dinas
                                </label>
                                <Field
                                  className="form-control"
                                  name={`namaPegawai.${index}.jaldir`}
                                  component={SelectComponent}
                                  options={optionsGolongan}
                                  placeholder="Pilih Golongan Jalan Dinas"
                                />
                              </div>

                              <div className="col">
                                <label className="form-label">
                                  Lama Perjalanan
                                </label>
                                <Field
                                  className="form-control"
                                  name={`namaPegawai.${index}.durasi`}
                                  as={InputComponent}
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
                              className="btn btn-primary text-white w-100"
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
