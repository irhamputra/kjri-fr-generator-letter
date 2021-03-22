import * as React from "react";
import { NextPage } from "next";
import { Form, FieldArray, Field, Formik } from "formik";
import axios, { AxiosResponse } from "axios";
import {
  InputComponent,
  SelectComponent,
  SelectStaff,
} from "../../../components/CustomField";
import useQueryJalDir from "../../../hooks/query/useQueryJalDir";
import useQuerySuratTugas from "../../../hooks/query/useQuerySuratTugas";
import { object, string } from "yup";
import { toast } from "react-hot-toast";
import { Trash as TrashIcon, Plus as PlusIcon } from "react-bootstrap-icons";
import { NextSeo } from "next-seo";
import Link from "next/link";

const Penugasan: NextPage = () => {
  const { data: listJalDir, isLoading: jalDirLoading } = useQueryJalDir();
  const {
    data: listSuratTugas,
    isLoading: suratTugasLoading,
  } = useQuerySuratTugas();

  const initialValues = {
    namaPegawai: [],
    nomorSurat: "",
  };

  if (suratTugasLoading && jalDirLoading) return <h4>Loading...</h4>;

  const optionsGolongan = listJalDir?.map((v) => ({
    label: v.golongan,
    value: v.harga,
  }));

  const optionsSuratTugas =
    listSuratTugas &&
    listSuratTugas?.map?.((v) => ({
      label: `${v.nomorSurat} - ${v.tujuanDinas}`,
      value: v.nomorSurat,
    }));

  const validationSchema = object().shape({
    nomorSurat: string().trim().required("Nomor Surat Wajib diisi!"),
  });

  return (
    <>
      <NextSeo
        title="Penugasan | Sistem Aplikasi KJRI Frankfurt"
        description="Penugasan Sistem Aplikasi KJRI Frankfurt"
      />
      <h3 className="mt-3">Surat Penugasan Perjalanan Dinas (SPD)</h3>
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            let response: AxiosResponse;
            try {
              response = await axios.put("/api/v1/penugasan", values);
              toast.success("SPD berhasil disimpan");
            } catch (e) {
              console.log(response);
              toast.error(e.message);
            }

            resetForm();
            setSubmitting(false);
          }}
        >
          {({ values }) => (
            <Form>
              <div
                style={{ padding: 16, background: "#f8f8f8", borderRadius: 4 }}
              >
                <label className="form-label">Nomor Surat</label>
                <Field
                  className="form-control"
                  name="nomorSurat"
                  component={SelectComponent}
                  options={optionsSuratTugas}
                  placeholder="Pilih Surat"
                />
              </div>

              <FieldArray
                name="namaPegawai"
                render={(arrayHelpers) => (
                  <div className="mt-3">
                    {values.namaPegawai.map((_, index) => (
                      <div key={index} className="mt-3 container-fluid p-0">
                        <div className="row">
                          <div className="col-11">
                            <div className="row">
                              <div className="col">
                                <label className="form-label">Nama Staff</label>
                                <Field
                                  className="form-control"
                                  name={`namaPegawai.${index}.pegawai`}
                                  value={_.pegawai}
                                  component={SelectStaff}
                                  placeholder="Input nama pegawai"
                                />
                              </div>

                              <div className="col">
                                <label className="form-label">
                                  Golongan Jalan Dinas
                                </label>
                                <Field
                                  className="form-control"
                                  name={`namaPegawai.${index}.jaldis`}
                                  component={SelectComponent}
                                  styles={{
                                    control: (provided) => ({
                                      ...provided,
                                      height: 66,
                                    }),
                                  }}
                                  value={_.jaldis}
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
                                  value={_.durasi}
                                  style={{
                                    height: 66,
                                  }}
                                  placeholder="(e.g 1 hari atau 2,5 hari)"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-1 d-flex align-items-end">
                            <button
                              className="btn btn-outline-danger w-100"
                              type="button"
                              style={{ height: 66 }}
                              onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                            >
                              <TrashIcon height={20} width={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-primary text-white w-100 mt-3"
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({
                          pegawai: {},
                          jaldis: "",
                          durasi: "",
                        })
                      }
                    >
                      <PlusIcon />
                      Tambah Pegawai
                    </button>

                    <div className="mt-3">
                      <button
                        className="btn btn-dark w-100 btn-lg"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              />
            </Form>
          )}
        </Formik>

        <ul className="mt-3">
          {suratTugasLoading ? (
            <p>Loading...</p>
          ) : (
            listSuratTugas?.map?.((v) => {
              return (
                <li key={v.nomorSurat}>
                  <Link
                    href="/layanan/penugasan/[id]"
                    as={`/layanan/penugasan/${v.suratTugasId}`}
                  >
                    <a>
                      {v.nomorSurat} - {v.tujuanDinas}
                    </a>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </>
  );
};

export default Penugasan;
