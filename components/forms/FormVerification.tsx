import * as React from "react";
import { formatDate } from "../../utils/dates";
import useVerifyAccount from "../../hooks/useVerifyAccount";
import BackToDashboard from "../BackToDashboard";

const FormVerification: React.FC = () => {
  const initialValues = {
    identityNumber: "",
    birthday: "",
  };

  const { handleChange, handleSubmit, values, errors, touched, setFieldValue, isSubmitting } =
    useVerifyAccount(initialValues);

  return (
    <form onSubmit={handleSubmit}>
      <div className="col-12">
        <h1 style={{ fontSize: 50 }}>Verifikasi Data</h1>
        <p className="w-100 small text-secondary">
          Masukan tanggal lahir anda kode yang telah diberikan Admin, <br />
          selanjutnya kita akan cek dan proses registrasi anda.
        </p>

        <section>
          <div>
            <label className="form-label">Nomor Identifikasi</label>
            <input
              className="form-control"
              onChange={handleChange}
              name="identityNumber"
              placeholder="Masukan code"
              maxLength={5}
              value={values.identityNumber}
            />
          </div>
          {errors.identityNumber && touched.identityNumber && (
            <p className="text-danger m-0">{errors.identityNumber}</p>
          )}

          <div className="mt-3">
            <label className="form-label">Tanggal Lahir</label>
            <input
              className="form-control"
              onChange={(e) => {
                const formattedDate = formatDate(e.currentTarget.value);
                setFieldValue("birthday", formattedDate);
              }}
              placeholder="DD.MM.YYYY"
              maxLength={10}
              name="birthday"
              value={values.birthday}
            />
          </div>
          {errors.birthday && touched.birthday && <p className="text-danger m-0">{errors.birthday}</p>}
        </section>

        <div className="mt-3">
          <button className="btn btn-dark w-100" type="submit">
            {isSubmitting ? "Mohon tunggu..." : "Cek Akun"}
          </button>
        </div>

        <BackToDashboard />
      </div>
    </form>
  );
};

export default FormVerification;
