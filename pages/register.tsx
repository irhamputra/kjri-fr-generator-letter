import { NextPage } from "next";
import Link from "next/link";
import { ArrowLeftShort } from "react-bootstrap-icons";
import * as React from "react";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../utils/validation/schema";
import { formatDate } from "../utils/dates";
import useVerifyAccount from "../hooks/useVerifyAccount";

const Register: NextPage = () => {
  const { mutateAsync } = useVerifyAccount();

  const initialValues = {
    identityNumber: "",
    birthday: "",
  };

  const { handleSubmit, handleChange, values, errors, touched, setFieldValue, isSubmitting } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      await mutateAsync(values);
      setSubmitting(false);
    },
  });

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <form onSubmit={handleSubmit}>
        <div className="col-12">
          <h1 style={{ fontSize: 50 }}>Registrasi</h1>
          <p className="w-100 small text-secondary">
            Masukan tanggal lahir anda kode yang telah diberikan Admin, <br />
            selanjutnya kita akan cek dan proses registrasi anda.
          </p>

          <div>
            <label className="form-label">Nomor Identifikasi</label>
            <input
              className="form-control"
              onChange={handleChange}
              name="identityNumber"
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
              placeholder="DD/MM/YYYY"
              maxLength={10}
              name="birthday"
              value={values.birthday}
            />
          </div>
          {errors.birthday && touched.birthday && <p className="text-danger m-0">{errors.birthday}</p>}

          <div className="mt-3">
            <button className="btn btn-dark w-100" type="submit">
              {isSubmitting ? "Mohon tunggu..." : "Cek Akun"}
            </button>
          </div>

          <Link href="/">
            <a className="align-items-center mt-5 d-flex">
              <ArrowLeftShort size={25} />
              <p className="m-0">Kembali ke Login</p>
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
