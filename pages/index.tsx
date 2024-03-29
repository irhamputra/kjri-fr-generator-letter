import { NextPage } from "next";
import * as React from "react";
import Link from "next/link";
import useAuthForm from "../hooks/useAuthForm";
import { useFetchBackground } from "../hooks/mutation/useMediaMutation";

const Home: NextPage = () => {
  const { handleSubmit, values, handleChange, errors, touched, isSubmitting } = useAuthForm(
    { email: "", password: "" },
    "login"
  );

  const { data } = useFetchBackground();

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        backgroundImage: `url(${data?.url})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form className="mt-5 p-4" onSubmit={handleSubmit} style={{ background: "white", borderRadius: "1rem" }}>
        <div className="text-center">
          <img src="/kjri-frankfurt.jpg" width="50%" alt="logo" />
          <h1>KJRI Frankfurt</h1>
          <p className="fw-bold">Sistem Informasi Kearsipan Terpadu</p>
        </div>

        <div className="mb-3">
          <input
            className={`form-control ${errors.email && touched.email ? "border-danger" : ""}`}
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="username"
          />
          <small className="text-danger">{errors.email && touched.email ? errors.email : " "}</small>
        </div>

        <div className="mb-3">
          <input
            className={`form-control ${errors.password && touched.password ? "border-danger" : ""}`}
            id="password"
            name="password"
            type="password"
            value={values.password}
            placeholder="Password"
            autoComplete="current-password"
            disabled={isSubmitting}
            onChange={handleChange}
          />
          <small className="text-danger">{errors.password && touched.password ? errors.password : " "}</small>
        </div>

        <div className="mb-3">
          <small>
            <Link href="/forget-password">Lupa Password?</Link>
          </small>
        </div>

        <button className="btn btn-dark w-100" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Mohon tunggu..." : "Login"}
        </button>

        <section className="text-center mb-2 mt-4">
          <hr />
          <Link href="/register" passHref>
            <a>
              <span className="small">Verifikasi Akun disini</span>
            </a>
          </Link>
        </section>
      </form>
    </div>
  );
};

export default Home;
