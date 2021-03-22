import * as React from "react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../../utils/validation/schema";
import useQueryJalDir from "../../hooks/query/useQueryJalDir";
import axios from "axios";
import { toast } from "react-hot-toast";
import { NextSeo } from "next-seo";
import useDeleteGolonganMutation from "../../hooks/mutation/useDeleteGolonganMutation";
import useEditGolonganMutation from "../../hooks/mutation/useEditGolonganMutation";
import useCreateGolonganMutation from "../../hooks/mutation/useCreateGolonganMutation";
import { v4 } from "uuid";

const ManageGolongan: NextPage = () => {
  const [status, setStatus] = React.useState("");

  const initialValues = {
    jenisGolongan: "",
    hargaGolongan: "",
    golId: "",
  };

  const { mutateAsync: editGolongan } = useEditGolonganMutation<
    typeof initialValues
  >();

  const { mutateAsync: createGolongan } = useCreateGolonganMutation();

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        if (status === "Edit") {
          await editGolongan(values);
        }

        if (!status) {
          await createGolongan(values);
        }
      } catch (e) {
        toast.error("Terjadi kesalahan teknis! Mohon ulangi kembali");
        throw new Error(e.message);
      }

      setStatus("");
      resetForm();
      setSubmitting(false);
    },
  });

  const { mutateAsync: deleteGolongan } = useDeleteGolonganMutation();
  const { data, isLoading } = useQueryJalDir();

  if (isLoading) return <h4>Loading...</h4>;

  const handleEdit = async (id: string) => {
    setStatus("Edit");
    const { data } = await axios.get(`/api/v1/jaldir/${id}`);
    await setFieldValue("jenisGolongan", data.golongan);
    await setFieldValue("hargaGolongan", data.harga);
    await setFieldValue("golId", id);
  };

  const handleDelete = async (id: string) => {
    await deleteGolongan(id);
  };

  return (
    <>
      <NextSeo
        title="Manage Golongan | Sistem Aplikasi KJRI Frankfurt"
        description="Manage Golongan Sistem Aplikasi KJRI Frankfurt"
      />
      <h4 className="mt-3">Manage Golongan</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label className="form-label">Jenis Golongan</label>
            <input
              name="jenisGolongan"
              value={values.jenisGolongan}
              onChange={handleChange}
              className="form-control"
            />
            {errors.jenisGolongan && touched.jenisGolongan && (
              <small className="text-danger">{errors.jenisGolongan}</small>
            )}
          </div>

          <div className="col">
            <label className="form-label">Harga</label>
            <input
              name="hargaGolongan"
              value={values.hargaGolongan}
              onChange={handleChange}
              className="form-control"
            />
            {errors.hargaGolongan && touched.hargaGolongan && (
              <small className="text-danger">{errors.hargaGolongan}</small>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-dark mt-3">
          Submit Golongan
        </button>
      </form>

      <table className="table mt-3">
        <thead>
          <tr>
            <th scope="col">Golongan</th>
            <th scope="col">Harga</th>
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody>
          {data.map((v) => (
            <tr key={v.golId}>
              <td scope="row">{v.golongan}</td>
              <td>$ {v.harga}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEdit(v.golId)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger mx-3"
                  onClick={() => handleDelete(v.golId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ManageGolongan;
