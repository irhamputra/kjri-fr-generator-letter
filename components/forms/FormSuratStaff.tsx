import React from "react";
import { Form, FieldArray, Field, Formik, FormikTouched } from "formik";
import { InputComponent, SelectComponent, SelectStaff } from "../../components/CustomField";
import useQuerySuratTugas from "../../hooks/query/useQuerySuratTugas";
import { object, string, array } from "yup";
import { Trash as TrashIcon, Plus as PlusIcon, ArrowRight } from "react-bootstrap-icons";
import useQueryUsers from "../../hooks/query/useQueryUsers";
import { useRouter } from "next/router";
import useCountUangHarianSPD from "../../hooks/useCountUangHarianSPD";

export type ForumSuratStaffInitialValues = {
  nomorSurat: string;
  fullDayKurs: number;
  namaPegawai: any[];
  tujuanDinas?: string;
};

const FormSuratStaff: React.FC<{
  onSave: (val: ForumSuratStaffInitialValues) => any;
  initialValues: ForumSuratStaffInitialValues;
}> = ({ onSave, initialValues }) => {
  const { data: listSuratTugas, isLoading: suratTugasLoading } = useQuerySuratTugas();
  const { push } = useRouter();
  const { countToUER, jalDirLoading } = useCountUangHarianSPD();

  const validationSchema = object().shape({
    nomorSurat: string().trim().required("nomor surat wajib diisi!"),
    namaPegawai: array()
      .of(
        object().shape({
          pegawai: object().required(),
          durasi: string()
            .matches(/^\d+(,5)?$/, "Masukan kelipatan 0,5. contoh : 7 atau 8,5")
            .required(),
        })
      )
      .min(1, "Minimal 1 pegawai"),
  });

  const { data: listUsers, isLoading: usersLoading } = useQueryUsers();
  const optionsSuratTugas =
    listSuratTugas &&
    listSuratTugas?.map?.((v: { nomorSurat: string; tujuanDinas: string }) => ({
      label: `${v.nomorSurat} - ${v.tujuanDinas}`,
      value: v.nomorSurat,
    }));

  if (suratTugasLoading && jalDirLoading && usersLoading) return <h4>Loading...</h4>;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        onSave(values);
        setSubmitting(false);
      }}
    >
      {({ values, errors, touched }) => {
        return (
          <Form>
            <div className="mb-3">
              <label className="form-label">Nomor Surat</label>
              {initialValues?.nomorSurat && initialValues?.tujuanDinas ? (
                <h5>{initialValues.nomorSurat + " - " + initialValues.tujuanDinas}</h5>
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
                      {values.namaPegawai?.map?.((_, index: number) => {
                        const error: string = (errors.namaPegawai as string)?.[index];
                        const touch = (touched.namaPegawai as FormikTouched<any>[])?.[index];

                        return (
                          <div key={index} className={`mb-3 container-fluid p-0`}>
                            <div className="row">
                              <div className="col-6">
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
                                {error?.durasi && touch?.durasi && (
                                  <small className="text-danger">
                                    {/* @ts-ignore */}
                                    {error?.durasi}
                                  </small>
                                )}
                              </div>
                              <div className="col">
                                <label className="form-label">Uang Harian</label>
                                <div className="d-flex align-items-center h-75">
                                  <h6>{countToUER(_.pegawai?.golongan, _.durasi, values.fullDayKurs)}</h6>
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
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <button
                    onClick={async () => await push("/layanan/penugasan/list")}
                    className="btn btn-outline-dark ms-2 btn"
                    type="button"
                  >
                    Kembali ke list
                  </button>
                </div>
                <button className="btn btn-dark btn" type="submit">
                  Selanjutnya
                  <ArrowRight style={{ marginLeft: 4 }} />
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormSuratStaff;
