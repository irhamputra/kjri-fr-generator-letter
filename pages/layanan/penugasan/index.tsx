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
import {
  Trash as TrashIcon,
  Plus as PlusIcon,
  Search,
} from "react-bootstrap-icons";
import { NextSeo } from "next-seo";
import { MessageCard } from "../../../components/Card";
import Fuse from "fuse.js";

const Penugasan: NextPage = () => {
  const [filteredList, setFilteredList] = React.useState([]);
  const [searchQuery, setSearch] = React.useState("");

  const { data: listJalDir, isLoading: jalDirLoading } = useQueryJalDir();
  const {
    data: listSuratTugas,
    isLoading: suratTugasLoading,
  } = useQuerySuratTugas();

  const initialValues = {
    namaPegawai: [],
    nomorSurat: "",
    surat: [],
  };

  const search = (query) => {
    const fuse = new Fuse(listSuratTugas, {
      keys: ["tujuanDinas"],
      includeScore: true,
    });

    const res = fuse.search(query);
    setFilteredList(res);
  };

  React.useEffect(() => {
    listSuratTugas && searchQuery.length > 1 && search(searchQuery);
  }, [searchQuery, suratTugasLoading]);

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
    nomorSurat: string().trim().required("nomor surat wajib diisi!"),
    surat: array().min(1).required("wajib menyertakan surat"),
    namaPegawai: array()
      .min(1, "nama pegawai wajib diisi")
      .required("nama pegawai wajib diisi"),
  });

  const usedList = searchQuery.length > 0 ? filteredList : listSuratTugas;

  console.log(usedList);

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
                              nama: "",
                              golongan: "",
                              jabatan: "",
                              durasi: "",
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
                <button className="btn btn-dark w-100 btn-lg" type="submit">
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="mt-5 row">
          <div className="d-flex">
            <h4 className="mb-3" style={{ flex: "1 1" }}>
              Surat yang telah dibuat
            </h4>
            <div className="input-group" style={{ maxWidth: 200 }}>
              <span className="input-group-text" id="durasi-hari">
                <Search />
              </span>
              <input
                className="form-control"
                type="text"
                placeholder="Telusuri surat..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {suratTugasLoading ? <p>Loading...</p> : null}
          {filteredList && searchQuery.length > 0
            ? filteredList.map((v) => {
                return (
                  <div key={v.item.suratTugasId} className="col-4">
                    <MessageCard
                      key={v.item.nomorSurat}
                      title={v.item.tujuanDinas}
                      number={v.item.nomorSurat}
                      link={`/layanan/penugasan/${v.item.suratTugasId}`}
                    />
                  </div>
                );
              })
            : null}
          {searchQuery.length > 0
            ? null
            : listSuratTugas?.map((v) => {
                return (
                  <div key={v.suratTugasId} className="col-4">
                    <MessageCard
                      key={v.nomorSurat}
                      title={v.tujuanDinas}
                      number={v.nomorSurat}
                      link={`/layanan/penugasan/${v.suratTugasId}`}
                    />
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default Penugasan;
