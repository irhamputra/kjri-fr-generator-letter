import * as React from "react";
import { NextPage } from "next";
import useAuthForm from "./hooks/useAuthForm";

const Login: NextPage = () => {
  const {
    handleSubmit,
    values,
    handleChange,
    errors,
    touched,
    isSubmitting,
  } = useAuthForm({ email: "", password: "" });

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email@domain.de"
            value={values.email}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="username"
          />
          {errors.email && touched.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            placeholder="password anda"
            autoComplete="current-password"
            disabled={isSubmitting}
            onChange={handleChange}
          />
          {errors.password && touched.password && <p>{errors.password}</p>}
        </div>

        <button disabled={isSubmitting} type="submit">
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
