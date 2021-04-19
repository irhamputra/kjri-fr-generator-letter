import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { object } from "yup";
import useEditUser from "../../hooks/mutation/useUserMutation";
import apiInstance from "../../utils/firebase/apiInstance";
import parseCookies from "../../utils/parseCookies";
import createSchema from "../../utils/validation/schema";

const MyProfile: React.FC<{ userData }> = ({ userData: { displayName, nip } }) => {
  const { back } = useRouter();
  const initialValues = {
    displayName: displayName,
    nip: nip,
  };

  const { mutateAsync, isLoading } = useEditUser();

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
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
        {/* <InputComponent endText="" placeholder="username" /> */}
      </div>
    </form>
  );
};

export async function getServerSideProps({ req }) {
  const cookie = parseCookies(req);
  const idToken = cookie["KJRIFR-U"];
  try {
    const {
      data: { nip, displayName },
    } = await apiInstance.get("/api/v1/user", {
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    });

    return {
      props: {
        userData: {
          displayName,
          nip,
        },
      },
    };
  } catch (e) {
    throw new Error(e.message);
  }
}

export default MyProfile;
