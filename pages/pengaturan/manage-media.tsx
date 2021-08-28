import axios from "axios";
import { useFormik } from "formik";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { object } from "yup";
import { ImageDropzone } from "../../components/Dropzone";
import { useAppState } from "../../contexts/app-state-context";
import { useFetchBackground, useUpdateBackground } from "../../hooks/mutation/useMediaMutation";
import createSchema from "../../utils/validation/schema";

const ManageMedia = () => {
  const { data } = useFetchBackground();
  const initialValues = {
    background: "",
    backgroundUrl: data?.url,
  };

  const { push } = useRouter();
  const { mutateAsync } = useUpdateBackground();
  const { dispatch } = useAppState();

  const { setFieldValue, values, resetForm, isSubmitting, handleSubmit, dirty } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      const {
        data: { url },
      } = await axios.post("/api/v1/media/background/upload", values.background);
      await mutateAsync({ url });
      dispatch({ type: "setIsEditing", payload: false });
      push("/pengaturan");
      resetForm();
      setSubmitting(false);
    },
  });

  useEffect(() => {
    dispatch({ type: "setIsEditing", payload: dirty });
  }, [dirty]);

  return (
    <section style={{ marginTop: "6rem" }}>
      <NextSeo
        title="Manage Golongan | Sistem Aplikasi KJRI Frankfurt"
        description="Manage Golongan Sistem Aplikasi KJRI Frankfurt"
      />
      <h4>Background Login</h4>
      <form onSubmit={handleSubmit}>
        <div className="row ">
          <div className="col-6 mb-3">
            <div className="aspect169Container mb-3">
              <img src={values.backgroundUrl} width="100%" height="100%" className="aspect169" />
            </div>
            <ImageDropzone
              placeholder="Klik atau Drag n drop untuk mengganti background"
              onAccept={(val) => {
                const formData = new FormData();
                formData.append("file", val);
                setFieldValue("background", formData);
                setFieldValue("backgroundUrl", URL.createObjectURL(val));
              }}
            />
          </div>
        </div>
        <div className="mt-3">
          <button disabled={isSubmitting} className="btn btn-dark " type="submit">
            Simpan Perubahan
          </button>

          <button className="btn btn-outline-danger mx-3" onClick={() => resetForm()} type="reset">
            Ulangi
          </button>
        </div>
      </form>
    </section>
  );
};

export default ManageMedia;
