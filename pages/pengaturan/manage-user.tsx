import * as React from "react";
import { NextPage } from "next";
import useAuthForm from "../../hooks/useAuthForm";

const ManageUser: NextPage = () => {
  const { values, handleChange, handleSubmit, errors, touched } = useAuthForm(
    { displayName: "", email: "", password: "", nip: "" },
    "register"
  );

  return (
    <>
      <h4 className="mt-3">Manage User</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-6 mt-3">
            <label className="form-label">Nama Pegawai</label>
            <input
              className="form-control"
              name="displayName"
              value={values.displayName}
              onChange={handleChange}
            />
          </div>

          <div className="col-6 mt-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-6 mt-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
          </div>

          <div className="col-6 mt-3">
            <label className="form-label">NIP</label>
            <input
              className="form-control"
              name="nip"
              value={values.nip}
              onChange={handleChange}
            />
          </div>

          <div className="mt-3">
            <button className="btn btn-dark" type="submit">
              Register User
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ManageUser;
