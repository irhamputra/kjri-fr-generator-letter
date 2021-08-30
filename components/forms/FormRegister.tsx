import * as React from "react";
import useRegisterAccount from "../../hooks/useRegisterAccount";
import BackToDashboard from "../BackToDashboard";

const FormVerification: React.FC = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const { handleChange, handleSubmit, values, errors, touched, isSubmitting } = useRegisterAccount(initialValues);

  return (
    <form onSubmit={handleSubmit}>
      <div className="col-12">
        <h1 style={{ fontSize: 50 }}>Registrasi</h1>
        <p className="w-100 small text-secondary">
          Masukan email dan password anda, <br />
          selanjutnya kita akan registrasi dan proses data anda.
        </p>

        <section>
          <div>
            <label className="form-label">Email</label>
            <input
              className="form-control"
              onChange={handleChange}
              placeholder="Masukan email anda"
              name="email"
              value={values.email}
            />
          </div>
          {errors.email && touched.email && <p className="text-danger m-0">{errors.email}</p>}

          <div className="mt-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              onChange={handleChange}
              type="password"
              placeholder="Masukan password anda"
              name="password"
              value={values.password}
            />
          </div>
          {errors.password && touched.password && <p className="text-danger m-0">{errors.password}</p>}
        </section>

        <div className="mt-3">
          <button className="btn btn-dark w-100" type="submit">
            {isSubmitting ? "Mohon tunggu..." : "Daftar Akun"}
          </button>
        </div>

        <BackToDashboard />
      </div>
    </form>
  );
};

export default FormVerification;
