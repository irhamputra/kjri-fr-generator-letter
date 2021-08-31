import * as React from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useQueryClient } from "react-query";
import { Auth } from "../../../typings/AuthQueryClient";
import FormSPD from "../../../components/forms/SPD";
import Stepper from "../../../components/Stepper";

const Penugasan: NextPage = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  if (!query?.isAdmin) throw new Error("Invalid permission");

  return (
    <section style={{ marginTop: "6rem" }}>
      <NextSeo
        title="Penugasan | Sistem Aplikasi KJRI Frankfurt"
        description="Penugasan Sistem Aplikasi KJRI Frankfurt"
      />

      <h3 style={{ marginBottom: 24 }}>Surat Penugasan Perjalanan Dinas (SPD)</h3>
      <FormSPD />
    </section>
  );
};

export default Penugasan;
