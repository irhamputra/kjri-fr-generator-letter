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

const { format } = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

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
    fullDayKurs: 0.84,
    halfDayKurs: 0.4,
  };

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
      .of(
        object().shape({
          pegawai: object().required(),
          jaldis: string().required(),
          durasi: string()
            .matches(/^\d+(,5)?$/, "Masukan kelipatan 0,5. contoh : 7 atau 8,5")
            .required(),
        })
      )
      .min(1, "Minimal 1 pegawai"),
  });

  const countEstimateCost = (v = [], fullDayKurs, halfDayKurs) => {
    let text = "";
    const listPegawai = v.map((v, index) => {
      if (index !== 0) text += " + ";
      const [fullDayDur, halfDayDur = ""] = v.durasi.split(",");
      let halfDay = 0;

      const fullDay =
        parseFloat(fullDayDur) * fullDayKurs * parseFloat(v.jaldis);

      text +=
        "(" +
        parseFloat(fullDayDur) +
        " x " +
        fullDayKurs +
        " x " +
        parseFloat(v.jaldis) +
        ")";

      if (halfDayDur === "5") {
        halfDay = halfDayKurs * parseFloat(v.jaldis);

        text += " + (" + halfDayKurs + " x " + parseFloat(v.jaldis) + ")";
      }

      const total = fullDay + halfDay;

      return total;
    });

    return { value: listPegawai.reduce((acc, cur) => acc + cur, 0), text };
  };

  const countDailyCost = (jaldis, duration, fullDayKurs, halfDayKurs) => {
    const [fullDayDur, halfDayDur = ""] = duration.split(",");

    let halfDay = 0;

    const fullDay = parseFloat(fullDayDur) * fullDayKurs * parseFloat(jaldis);

    if (halfDayDur === "5") {
      halfDay = halfDayKurs * parseFloat(jaldis);
    }

    return fullDay + halfDay || 0;
  };

  if (suratTugasLoading && jalDirLoading && usersLoading)
    return <h4>Loading...</h4>;

  if (!isAdmin) throw new Error("Invalid permission");

  return (
    <section className="mt-3">
      <NextSeo
        title="Penugasan | Sistem Aplikasi KJRI Frankfurt"
        description="Penugasan Sistem Aplikasi KJRI Frankfurt"
      />
      <h3>Surat Penugasan Perjalanan Dinas (SPD)</h3>
      <div className="row">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (
            { namaPegawai, halfDayKurs, fullDayKurs, ...values },
            { setSubmitting, resetForm }
          ) => {
            setSubmitting(true);
            let response: AxiosResponse;
            const newValues = {
              listPegawai: namaPegawai.map((v) => {
                const total = countDailyCost(
                  v.jaldis,
                  v.durasi,
                  fullDayKurs,
                  halfDayKurs
                );

                return { ...v, uangHarian: format(total) };
              }),
              ...values,
            };

            try {
              response = await axios.put("/api/v1/penugasan", newValues);
              toast.success("SPD berhasil disimpan");
            } catch (e) {
              toast.error(e.message);
              throw new Error(e.message);
            }

            await push("/layanan/penugasan/list");
            resetForm();
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched }) => {
            return (
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
                <div className="mb-3">
                  <label className="form-label">Kurs Uang harian</label>
                  <div
                    style={{
                      padding: 16,
                      background: "#f8f8f8",
                      borderRadius: 4,
                    }}
                  >
                    <div className="row">
                      <div className="col-3">
                        <label className="form-label">Sehari penuh :</label>
                        <Field
                          className="form-control"
                          name="fullDayKurs"
                          endText="$"
                          value={values.fullDayKurs}
                          as={InputComponent}
                          options={optionsSuratTugas}
                          placeholder="Pilih Surat"
                        />
                      </div>
                      <div className="col-3">
                        <label className="form-label">Setengah hari :</label>
                        <Field
                          className="form-control"
                          name="halfDayKurs"
                          endText="$"
                          as={InputComponent}
                          value={values.halfDayKurs}
                          options={optionsSuratTugas}
                          placeholder="Pilih Surat"
                        />
                      </div>
                    </div>
                  </div>
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
                          {values.namaPegawai.map((_, index) => {
                            const error = errors.namaPegawai?.[index] || {};
                            const touch = touched.namaPegawai?.[index] || {};
                            return (
                              <div
                                key={index}
                                className={`mb-3 container-fluid p-0`}
                              >
                                <div className="row">
                                  <div className="col-4">
                                    <label className="form-label">
                                      Nama Staff
                                    </label>
                                    <Field
                                      className="form-control"
                                      name={`namaPegawai.${index}.pegawai`}
                                      value={_.pegawai}
                                      component={SelectStaff}
                                      options={listUsers}
                                      placeholder="Input nama pegawai"
                                    />
                                    {error?.pegawai && touch.pegawai && (
                                      <small className="text-danger">
                                        {error?.pegawai}
                                      </small>
                                    )}
                                  </div>

                                  <div className="col-3">
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
                                    {error?.jaldis && touch.jaldis && (
                                      <small className="text-danger">
                                        {error?.jaldis}
                                      </small>
                                    )}
                                  </div>

                                  <div className="col-2">
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
                                    {error?.durasi && touch.durasi && (
                                      <small className="text-danger">
                                        {error?.durasi}
                                      </small>
                                    )}
                                  </div>
                                  <div className="col">
                                    <label className="form-label">
                                      Uang Harian
                                    </label>
                                    <div className="d-flex align-items-center h-75">
                                      <h6>
                                        {format(
                                          countDailyCost(
                                            _.jaldis,
                                            _.durasi,
                                            values.fullDayKurs,
                                            values.halfDayKurs
                                          )
                                        )}
                                      </h6>
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
                            );
                          })}

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
            );
          }}
        </Formik>
      </div>
    </section>
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
