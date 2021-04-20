import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { object } from "yup";
import useEditUser from "../../hooks/mutation/useUserMutation";
import createSchema from "../../utils/validation/schema";
import { useQueryClient } from "react-query";
import { Auth } from "../../typings/AuthQueryClient";

const MyProfile = () => {
  const { back } = useRouter();
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  const initialValues = {
    displayName: query?.displayName ?? "",
    nip: query?.nip ?? "",
  };

  const { mutateAsync, isLoading } = useEditUser();

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: object().shape(createSchema(initialValues) ?? {}),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const { nip: nipVal, ...rest } = values;
      const nip = nipVal === "" ? "-" : nipVal;
      setSubmitting(true);
      await mutateAsync({ nip, ...rest });
      resetForm();
      setSubmitting(false);
      back();
    },
  });

  if (isLoading) return <div>Updating...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="container-sm" style={{ maxWidth: "576px" }}>
        <h3 className="mt-5 mb-3">Profile</h3>

        <div className="row">
          <div className="col">
            <label className="form-label">Nama Tampilan</label>
            <input name="displayName" value={values.displayName} onChange={handleChange} className="form-control" />
            {errors.displayName && touched.displayName && <small className="text-danger">{errors.displayName}</small>}
          </div>
        </div>
        <div className="row mt-2">
          <div className="col">
            <label className="form-label">NIP</label>
            <input name="nip" value={values.nip} onChange={handleChange} className="form-control" />
            {errors.nip && touched.nip && <small className="text-danger">{errors.nip}</small>}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col d-flex" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn-dark btn" type="submit">
              Edit Profile
            </button>

            <button onClick={() => back()} className="btn btn-outline-dark ms-2 btn" type="button">
              Kembali
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MyProfile;
