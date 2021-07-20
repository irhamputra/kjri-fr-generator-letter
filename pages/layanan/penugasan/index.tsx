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
  const [activeIndex, setActive] = React.useState(0);

  const options = [
    { number: 1, text: "Nomor Surat dan Staff" },
    { number: 2, text: "Destinasi" },
    { number: 3, text: "Selesai" },
  ];

  if (!query?.isAdmin) throw new Error("Invalid permission");

  return (
    <section style={{ marginTop: "6rem" }}>
      <NextSeo
        title="Penugasan | Sistem Aplikasi KJRI Frankfurt"
        description="Penugasan Sistem Aplikasi KJRI Frankfurt"
      />

      <h3 style={{ marginBottom: 24 }}>Surat Penugasan Perjalanan Dinas (SPD)</h3>

      <div style={{ background: "#f8f8f8", borderRadius: 4 }} className="p-3">
        <Stepper data={options} activeIndex={activeIndex} />
      </div>
      <div className="row p-3 mb-5">
        <FormSPD onPageIndexChange={(val) => setActive(val as number)} />
      </div>
    </section>
  );
};

export default Penugasan;
