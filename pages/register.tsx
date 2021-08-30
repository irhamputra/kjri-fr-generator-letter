import { GetServerSideProps, NextPage } from "next";
import * as React from "react";
import { useRouter } from "next/router";
import FormVerification from "../components/forms/FormVerification";
import FormRegister from "../components/forms/FormRegister";
import apiInstance from "../utils/firebase/apiInstance";

const Register: NextPage = () => {
  const { query } = useRouter();

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      {!query.id && !query.code ? <FormVerification /> : <FormRegister />}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  if (query.id) {
    const { data } = await apiInstance.get(`/api/v1/user/${query.id}`);

    if (!data.codeId) {
      return {
        redirect: { destination: "/", permanent: false },
      };
    }

    return { props: {} };
  }

  return { props: {} };
};

export default Register;
