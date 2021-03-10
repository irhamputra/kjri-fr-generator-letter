import { NextPage } from "next";
import * as React from "react";
import Link from "next/link";
import useAuthForm from "../hooks/useAuthForm";

const Home: NextPage = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const {
    handleSubmit,
    values,
    handleChange,
    errors,
    touched,
    isSubmitting,
  } = useAuthForm(initialValues, "login");

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit}>
        <div className="text-center">
          <img src="/kjri-frankfurt.jpg" width="50%" alt="logo" />
          <h1>KJRI Frankfurt</h1>
        </div>

        <div className="mb-3">
          <input
            className={`form-control ${errors.email ? "border-danger" : ""}`}
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="username"
          />
          <small className="text-danger">
            {errors.email && touched.email ? errors.email : " "}
          </small>
        </div>

        <div className="mb-3">
          <input
            className={`form-control ${errors.password ? "border-danger" : ""}`}
            id="password"
            name="password"
            type="password"
            value={values.password}
            placeholder="Password"
            autoComplete="current-password"
            disabled={isSubmitting}
            onChange={handleChange}
          />
          <small className="text-danger">
            {errors.password && touched.password ? errors.password : " "}
          </small>
        </div>

        <div className="mb-3">
          <small>
            <Link href="/forget-password">Lupa Password?</Link>
          </small>
        </div>

        <button
          className="btn btn-dark w-100 mb-2"
          disabled={isSubmitting}
          type="submit"
        >
          Login
        </button>

        <hr />

        <div className="text-center">
          <p>
            Belum terdaftar? Silahkan{" "}
            <Link href="/register">
              <a>Register disini</a>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Home;
