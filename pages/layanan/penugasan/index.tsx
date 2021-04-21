import * as React from "react";
import { NextPage } from "next";
import { Form, FieldArray, Field, Formik, FormikTouched } from "formik";
import axios, { AxiosResponse } from "axios";
import { DropzoneComponent, InputComponent, SelectComponent, SelectStaff } from "../../../components/CustomField";
import useQueryJalDir from "../../../hooks/query/useQueryJalDir";
import useQuerySuratTugas from "../../../hooks/query/useQuerySuratTugas";
import { object, string, array } from "yup";
import { toast } from "react-hot-toast";
import { Trash as TrashIcon, Plus as PlusIcon } from "react-bootstrap-icons";
import { NextSeo } from "next-seo";
import useQueryUsers from "../../../hooks/query/useQueryUsers";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "react-query";
import { Auth } from "../../../typings/AuthQueryClient";

const { format } = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
});

const Penugasan: NextPage<{ editId: string }> = ({ editId }) => {
  const { push } = useRouter();
  const { data: listJalDir, isLoading: jalDirLoading } = useQueryJalDir();
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  const { data: editedData } = useQuery(
    ["fetchSingleSurat", editId],
    async () => {
      const { data } = await axios.get(`/api/v1/surat-tugas/${editId}`);

      return data;
    },
    {
      enabled: !!editId,
    }
  );

  const { data: listSuratTugas, isLoading: suratTugasLoading } = useQuerySuratTugas();

  const { data: listUsers, isLoading: usersLoading } = useQueryUsers();
  const initialValues = {
    namaPegawai: editedData?.listPegawai || [],
    nomorSurat: editedData?.nomorSurat || "",
    fullDayKurs: 0.84,
  };

  const optionsGolongan = listJalDir?.map((v: { golongan: string; harga: string }) => ({
    label: v.golongan,
    value: v.harga,
  }));

  const optionsSuratTugas =
    listSuratTugas &&
    listSuratTugas?.map?.((v: { nomorSurat: string; tujuanDinas: string }) => ({
      label: `${v.nomorSurat} - ${v.tujuanDinas}`,
      value: v.nomorSurat,
    }));

  const validationSchema = object().shape({
    nomorSurat: string().trim().required("nomor surat wajib diisi!"),
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

  const countDailyCost = (jaldis: string, duration: string, fullDayKurs: number) => {
    const [fullDayDur, halfDayDur = ""] = duration.split(",");

    let halfDay = 0;

    const days = parseFloat(fullDayDur) * fullDayKurs * parseFloat(jaldis);
    const oneFullDay = fullDayKurs * parseFloat(jaldis);

    if (halfDayDur === "5") {
      halfDay = oneFullDay * 0.4;
    }

    return days + halfDay || 0;
  };

  if (suratTugasLoading && jalDirLoading && usersLoading) return <h4>Loading...</h4>;

  if (!query?.isAdmin) throw new Error("Invalid permission");

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
          enableReinitialize
          onSubmit={async ({ namaPegawai, fullDayKurs, ...values }, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            let response: AxiosResponse<Record<string, string>>;

            const newValues = {
              listPegawai: namaPegawai.map((v: { jaldis: string; durasi: string }) => {
                const total = countDailyCost(v.jaldis, v.durasi, fullDayKurs);

                return { ...v, uangHarian: format(total) };
              }),
              ...values,
            };

            try {
              response = await axios.put("/api/v1/penugasan", newValues);
            } catch (e) {
              toast.error(e.message);
              throw new Error(e.message);
            }

            toast.success(response.data.message);

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
                  {editedData?.nomorSurat && editedData?.tujuanDinas ? (
                    <h5>{editedData.nomorSurat + " - " + editedData.tujuanDinas}</h5>
                  ) : (
                    <>
                      <Field
                        className="form-control"
                        name="nomorSurat"
                        component={SelectComponent}
                        value={values.nomorSurat}
                        options={optionsSuratTugas}
                        placeholder="Pilih Surat"
                      />
                      {errors.nomorSurat && touched.nomorSurat && (
                        <small className="text-danger">{errors.nomorSurat}</small>
                      )}
                    </>
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
                          {values.namaPegawai.map(
                            (_: { pegawai: Record<string, string>; jaldis: string; durasi: string }, index: number) => {
                              const error: string = (errors.namaPegawai as string)?.[index];
                              const touch = (touched.namaPegawai as FormikTouched<any>)?.[index];
                              return (
                                <div key={index} className={`mb-3 container-fluid p-0`}>
                                  <div className="row">
                                    <div className="col-4">
                                      <label className="form-label">Nama Staff</label>
                                      <Field
                                        className="form-control"
                                        name={`namaPegawai.${index}.pegawai`}
                                        value={_.pegawai}
                                        component={SelectStaff}
                                        options={usersLoading ? [] : listUsers}
                                        placeholder="Input nama pegawai"
                                      />
                                      {/* @ts-ignore */}
                                      {error?.pegawai && touch.pegawai && (
                                        <small className="text-danger">
                                          {/* @ts-ignore */}
                                          {error?.pegawai}
                                        </small>
                                      )}
                                    </div>

                                    <div className="col-3">
                                      <label className="form-label">Golongan Jalan Dinas</label>
                                      <Field
                                        className="form-control"
                                        name={`namaPegawai.${index}.jaldis`}
                                        component={SelectComponent}
                                        styles={{
                                          control: (provided: Record<string, string>) => ({
                                            ...provided,
                                            height: 66,
                                          }),
                                        }}
                                        value={_.jaldis}
                                        options={optionsGolongan}
                                        placeholder="Pilih Golongan Jalan Dinas"
                                      />
                                      {/* @ts-ignore */}
                                      {error?.jaldis && touch.jaldis && (
                                        <small className="text-danger">
                                          {/* @ts-ignore */}
                                          {error?.jaldis}
                                        </small>
                                      )}
                                    </div>

                                    <div className="col-2">
                                      <label className="form-label">Lama Perjalanan</label>
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
                                      {/* @ts-ignore */}
                                      {error?.durasi && touch.durasi && (
                                        <small className="text-danger">
                                          {/* @ts-ignore */}
                                          {error?.durasi}
                                        </small>
                                      )}
                                    </div>
                                    <div className="col">
                                      <label className="form-label">Uang Harian</label>
                                      <div className="d-flex align-items-center h-75">
                                        <h6>{format(countDailyCost(_.jaldis, _.durasi, values.fullDayKurs))}</h6>
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
                            }
                          )}

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
                  <button className="btn btn-dark btn" type="submit">
                    {editId ? "Edit SPD" : "Submit SPD"}
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

export default Penugasan;
