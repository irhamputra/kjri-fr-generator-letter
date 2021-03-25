import * as React from "react";
import { NextPage } from "next";
import { useFormik } from "formik";
import { object } from "yup";
import Link from "next/link";
import createSchema from "../utils/validation/schema";
import { ArrowLeftShort } from "react-bootstrap-icons";

const LupaPassword: NextPage = () => {
  const { handleSubmit, handleChange, values, errors, touched } = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: object().shape(createSchema({ email: "" })),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);

      console.log(values);

      setSubmitting(false);
    },
  });

  return (
    <div className="m-auto row px-5 w-25 mt-5">
      <form onSubmit={handleSubmit}>
        <div className="col-12 mt-5">
          <h1 style={{ fontSize: 50 }}>Lupa Password</h1>
          <p className="w-100 small text-secondary">
            Masukan Email anda, selanjutnya kami akan kirimkan link untuk reset
            ulang password anda
          </p>

          <label className="form-label">Email</label>
          <input
            className="form-control"
            onChange={handleChange}
            name="email"
            value={values.email}
          />
          {errors.email && touched.email && (
            <p className="text-danger m-0">{errors.email}</p>
          )}

          <div className="mt-3">
            <button className="btn btn-dark w-100" type="submit">
              Reset Password
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

export default LupaPassword;