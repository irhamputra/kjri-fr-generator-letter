import * as React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import DefaultErrorPage from "next/error";
import { useFormik } from "formik";
import { useMemo } from "react";
import sleep from "../../utils/sleep";
import useValidation from "../hooks/useValidation";

const LetterType: NextPage = () => {
  const { query } = useRouter();

  const validationSchema = useValidation(["archiveId"]);

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      archiveId: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      // TODO: make a request
      await sleep(1200);
      console.log({ values });

      setSubmitting(false);
    },
  });

  if (!["spd", "sppd"].includes(query.type as string)) {
    return <DefaultErrorPage statusCode={404} />;
  }

  const typeOfLetter = useMemo(() => (query.type as string).toUpperCase(), [
    query,
  ]);

  return (
    <>
      <h1>{typeOfLetter}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="archiveId">Archive ID</label>
          <input
            value={values.archiveId}
            onChange={handleChange}
            name="archiveId"
            id="archiveId"
            disabled={isSubmitting}
          />
          {errors.archiveId && touched.archiveId && <p>{errors.archiveId}</p>}
        </div>

        <button disabled={isSubmitting} type="submit">
          Submit {typeOfLetter}
        </button>
      </form>
    </>
  );
};

export default LetterType;
