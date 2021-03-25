import * as React from "react";
import { NextPage } from "next";
import { Form, FieldArray, Field, Formik } from "formik";
import axios, { AxiosResponse } from "axios";
import {
  DropzoneComponent,
  InputComponent,
  SelectComponent,
  SelectStaff,
} from "../../../components/CustomField";
import useQueryJalDir from "../../../hooks/query/useQueryJalDir";
import useQuerySuratTugas from "../../../hooks/query/useQuerySuratTugas";
import { object, string, array } from "yup";
import { toast } from "react-hot-toast";
import { Trash as TrashIcon, Plus as PlusIcon } from "react-bootstrap-icons";
import { NextSeo } from "next-seo";
import useQueryUsers from "../../../hooks/query/useQueryUsers";
import { useRouter } from "next/router";
import parseCookies from "../../../utils/parseCookies";
import apiInstance from "../../../utils/firebase/apiInstance";

const Penugasan: NextPage<{ isAdmin: string }> = ({ isAdmin }) => {
  const { push } = useRouter();
  const { data: listJalDir, isLoading: jalDirLoading } = useQueryJalDir();

  const {
    data: listSuratTugas,
    isLoading: suratTugasLoading,
  } = useQuerySuratTugas();

  const { data: listUsers, isLoading: usersLoading } = useQueryUsers();

  const initialValues = {
    namaPegawai: [],
    nomorSurat: "",
    surat: [],
  };

  if (suratTugasLoading && jalDirLoading && usersLoading)
    return <h4>Loading...</h4>;

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
    nomorSurat: string().trim().required("nomor surat wajib diisi!"),
    surat: array().min(1).required("wajib menyertakan surat"),
    namaPegawai: array()
      .min(1, "nama pegawai wajib diisi")
      .required("nama pegawai wajib diisi"),
  });

  if (!isAdmin) throw new Error("Invalid permission");

  return (
    <>
      <NextSeo
        title="Penugasan | Sistem Aplikasi KJRI Frankfurt"
        description="Penugasan Sistem Aplikasi KJRI Frankfurt"
      />
      <h3 className="mt-3">Surat Penugasan Perjalanan Dinas (SPD)</h3>
      <div className="row">
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

            await push("/layanan/penugasan/list");
            resetForm();
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Nomor Surat</label>
                <Field
                  className="form-control"
                  name="nomorSurat"
                  component={SelectComponent}
                  options={optionsSuratTugas}
                  placeholder="Pilih Surat"
                />
                {errors.nomorSurat && touched.nomorSurat && (
                  <small className="text-danger">{errors.nomorSurat}</small>
                )}
              </div>

              <label className="form-label">Staff</label>
              <div
                style={{
                  padding: 16,
                  background: "#f8f8f8",
                  borderRadius: 4,
                }}
              >
                <FieldArray
                  name="namaPegawai"
                  render={(arrayHelpers) => (
                    <>
                      <div className="p-0 mb-1">
                        {values.namaPegawai.map((_, index) => (
                          <div
                            key={index}
                            className={`mb-3 container-fluid p-0`}
                          >
                            <div className="row">
                              <div className="col">
                                <label className="form-label">Nama Staff</label>
                                <Field
                                  className="form-control"
                                  name={`namaPegawai.${index}.pegawai`}
                                  value={_.pegawai}
                                  component={SelectStaff}
                                  options={listUsers}
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
                          className="btn btn-primary text-white mt-3"
                          type="button"
                          onClick={() =>
                            arrayHelpers.push({
                              durasi: "",
                              pegawai: {},
                            })
                          }
                        >
                          <PlusIcon />
                          Tambah Pegawai
                        </button>
                      </div>
                      {errors.namaPegawai && touched.namaPegawai && (
                        <small className="text-danger">
                          {errors.namaPegawai}
                        </small>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="mt-3">
                <label className="form-label">Surat</label>
                <Field
                  className="form-control"
                  name="surat"
                  component={DropzoneComponent}
                  options={optionsSuratTugas}
                  placeholder="Pilih Surat"
                />
                {errors.surat && touched.surat && (
                  <small className="text-danger">{errors.surat}</small>
                )}
              </div>
              <div className="mt-3">
                <button className="btn btn-dark btn" type="submit">
                  Submit SPD
                </button>

                <button
                  onClick={async () => await push("/layanan/penugasan/list")}
                  className="btn btn-outline-dark ms-2 btn"
                  type="button"
                >
                  Kembali ke list
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export async function getServerSideProps({ req }) {
  const cookie = parseCookies(req);
  const idToken = cookie["KJRIFR-U"];
  try {
    const {
      data: { email, isAdmin },
    } = await apiInstance.get("/api/v1/user", {
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    });

    return {
      props: {
        isAdmin,
        email,
      },
    };
  } catch (e) {
    throw new Error(e.message);
  }
}

export default Penugasan;
