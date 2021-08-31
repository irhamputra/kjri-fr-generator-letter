import * as React from "react";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../utils/validation/schema";
import { useMutation } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const RegisterUser: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const initialValues = {
    email: "",
  };

  const { mutateAsync } = useMutation(
    "registerUser",
    async (values: typeof initialValues) => {
      try {
        const { data } = await axios.post<{ message: string }>("/api/v1/users", values);

        return data;
      } catch (e) {
        throw new Error("User telah terdaftar");
      }
    },
    {
      onSuccess: (data) => {
        toast.success(data.message || "Kode verifikasi telah terkirim");
      },
      onError: () => {
        toast.error("User telah terdaftar");
      },
    }
  );

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      await mutateAsync(values);
      resetForm();
      setSubmitting(false);
    },
  });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Manage User</h4>
        <div>
          <button onClick={() => setOpen((prevState) => !prevState)} className="btn btn-dark">
            Tambah Staff +
          </button>
        </div>
      </div>

      <div>
        {open ? (
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-3">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="form-control"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
                {errors.email && touched.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="col-12">
                <button className="btn btn-dark">Register user</button>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    </>
  );
};

export default RegisterUser;
