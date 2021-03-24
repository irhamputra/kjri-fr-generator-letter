import * as React from "react";
import { NextPage } from "next";
import useAuthForm from "../../hooks/useAuthForm";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Trash } from "react-bootstrap-icons";
import { toast } from "react-hot-toast";

const ManageUser: NextPage = () => {
  const queryClient = useQueryClient();

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
  } = useAuthForm(
    {
      displayName: "",
      email: "",
      password: "",
      nip: "",
      golongan: "",
      jabatan: "",
    },
    "register"
  );

  const { data, isLoading } = useQuery("fetchUser", async () => {
    const { data } = await axios.get("/api/v1/users");

    return data;
  });

  const { mutateAsync } = useMutation(
    "deleteUser",
    async (uid: string) => {
      try {
        const { data } = await axios.delete(`/api/v1/user/${uid}`);

        return data;
      } catch (e) {
        toast.error("Gagal menghapus user!");
        throw new Error(e.message);
      }
    },
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries("fetchUser");

        toast.success(data.message);
      },
    }
  );

  if (isLoading) return <h4>Loading...</h4>;

  return (
    <>
      <h4 className="mt-3">Manage User</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-6 mt-3">
            <label className="form-label">Nama Staff</label>
            <input
              disabled={isSubmitting}
              className="form-control"
              type="text"
              name="displayName"
              value={values.displayName}
              onChange={handleChange}
            />
            {errors.displayName && touched.displayName && (
              <small className="text-danger">{errors.displayName}</small>
            )}
          </div>

          <div className="col-6 mt-3">
            <label className="form-label">Email</label>
            <input
              disabled={isSubmitting}
              className="form-control"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && touched.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>

          <div className="col-6 mt-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              disabled={isSubmitting}
              className="form-control"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && touched.password && (
              <small className="text-danger">{errors.password}</small>
            )}
          </div>

          <div className="col-6 mt-3">
            <label className="form-label">NIP</label>
            <input
              className="form-control"
              name="nip"
              disabled={isSubmitting}
              type="text"
              value={values.nip}
              onChange={handleChange}
            />
            {errors.nip && touched.nip && (
              <small className="text-danger">{errors.nip}</small>
            )}
          </div>

          <div className="col-6 mt-3">
            <label className="form-label">Golongan</label>
            <input
              className="form-control"
              name="golongan"
              type="text"
              disabled={isSubmitting}
              value={values.golongan}
              onChange={handleChange}
            />
            {errors.golongan && touched.golongan && (
              <small className="text-danger">{errors.golongan}</small>
            )}
          </div>

          <div className="col-6 mt-3">
            <label className="form-label">Jabatan</label>
            <input
              className="form-control"
              name="jabatan"
              type="text"
              disabled={isSubmitting}
              value={values.jabatan}
              onChange={handleChange}
            />
            {errors.jabatan && touched.jabatan && (
              <small className="text-danger">{errors.jabatan}</small>
            )}
          </div>

          <div className="mt-3">
            <button
              disabled={isSubmitting}
              className="btn btn-dark"
              type="submit"
            >
              Register User
            </button>
          </div>
        </div>
      </form>

      <table className="table caption-top mt-3">
        <caption>List Staff</caption>
        <thead>
          <tr>
            <th scope="col">NIP</th>
            <th scope="col">Nama Staff</th>
            <th scope="col">Golongan</th>
            <th scope="col">Jabatan</th>
            <th scope="col">Email</th>
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody>
          {data?.map?.((v) => (
            <tr key={v.uid}>
              <td scope="row">{v.nip}</td>
              <td>{v.displayName}</td>
              <td>{v.golongan}</td>
              <td>{v.jabatan}</td>
              <td>{v.email}</td>
              <td>
                <button
                  onClick={async () => {
                    await mutateAsync(v.uid);
                  }}
                  className="btn-danger btn"
                >
                  <Trash size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ManageUser;
