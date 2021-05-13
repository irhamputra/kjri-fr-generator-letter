import React from "react";
import useAuthForm from "../../hooks/useAuthForm";
import { Golongan } from "../../typings/Golongan";
import capitalizeFirstLetter from "../../utils/capitalize";
import useQueryJalDir from "../../hooks/query/useQueryJalDir";
import { useQueryUserById } from "../../hooks/query/useQueryUser";
import Select from "react-select";
import useManageUserForm from "../../hooks/form/useManageUserForm";

const ManageUserForm: React.FC<{ userId?: string }> = ({ userId }) => {
  const { data: listGolongan } = useQueryJalDir();
  const { data: editedUser = {} } = useQueryUserById(userId as string);
  const { displayName, email, nip, golongan, jabatan, role } = editedUser;

  const initValues = {
    displayName: displayName ?? "",
    email: email ?? "",
    nip: nip ?? "",
    golongan: golongan ?? "",
    jabatan: jabatan ?? "",
    role: role ?? "",
  };
  const fetcher = !userId ? useAuthForm(initValues, "register") : useManageUserForm(initValues, userId);
  const { values, handleChange, handleSubmit, setFieldValue, errors, touched, isSubmitting, resetForm } = fetcher;

  const optionsRole = [
    { label: "Staff", value: "default" },
    { label: "Tata Usaha", value: "TU" },
  ];
  const optionsGolongan = listGolongan?.map(({ golongan }: Golongan) => ({ label: golongan, value: golongan })) ?? [];
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-3 mt-3">
          <label className="form-label">Nama Staff</label>
          <input
            disabled={isSubmitting}
            className="form-control"
            type="text"
            name="displayName"
            value={capitalizeFirstLetter(values.displayName ?? "")}
            onChange={handleChange}
          />
          {errors.displayName && touched.displayName && <small className="text-danger">{errors.displayName}</small>}
        </div>

        <div className="col-3 mt-3">
          <label className="form-label">Email</label>
          <input
            disabled={isSubmitting}
            className="form-control"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && touched.email && <small className="text-danger">{errors.email}</small>}
        </div>

        {!userId && (
          <div className="col-3 mt-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              disabled={isSubmitting}
              className="form-control"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && touched.password && <small className="text-danger">{errors.password}</small>}
          </div>
        )}

        <div className="col-3 mt-3">
          <label className="form-label">NIP</label>
          <input
            className="form-control"
            name="nip"
            disabled={isSubmitting}
            type="text"
            value={values.nip}
            onChange={handleChange}
          />
          {errors.nip && touched.nip && <small className="text-danger">{errors.nip}</small>}
        </div>

        <div className="col-3 mt-3">
          <label className="form-label">Golongan</label>
          <Select
            value={values.golongan ? { label: values.golongan, value: values.golongan as any } : undefined}
            onChange={({ value }) => setFieldValue("golongan", value)}
            defaultValue={optionsGolongan[0]}
            options={optionsGolongan}
          />
          {errors.golongan && touched.golongan && <small className="text-danger">{errors.golongan}</small>}
        </div>

        <div className="col-3 mt-3">
          <label className="form-label">Jabatan</label>
          <input
            className="form-control"
            name="jabatan"
            type="text"
            disabled={isSubmitting}
            value={capitalizeFirstLetter(values.jabatan ?? "")}
            onChange={handleChange}
          />
          {errors.jabatan && touched.jabatan && <small className="text-danger">{errors.jabatan}</small>}
        </div>

        <div className="col mt-3">
          <label className="form-label">Role</label>

          <Select
            onChange={(v) => setFieldValue("role", v?.value)}
            value={values.role ? optionsRole.filter(({ value }) => value === values.role)[0] : undefined}
            defaultValue={optionsRole[0]}
            options={optionsRole}
          />

          {errors.role && touched.role && <small className="text-danger">{errors.role}</small>}
          {values.role === "TU" && (
            <small className="text-info">Role "Tata Usaha" tidak akan muncul di list Staff</small>
          )}
        </div>

        <div className="mt-3">
          <button disabled={isSubmitting} className="btn btn-dark" type="submit">
            {!userId ? "Register User" : "Edit User"}
          </button>
          <button
            disabled={isSubmitting}
            onClick={() => resetForm()}
            className="btn btn-outline-danger ms-3"
            type="button"
          >
            Ulangi
          </button>
        </div>
      </div>
    </form>
  );
};

export default ManageUserForm;
