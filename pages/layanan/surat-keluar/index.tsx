import * as React from "react";
import { NextPage } from "next";

import { NextSeo } from "next-seo";
import SuratKeluarForm from "../../../components/forms/SuratKeluar";

const SuratKeluar: NextPage = () => {
  return (
    <div className="mt-3">
      <NextSeo
        title="Surat Keluar | Sistem Aplikasi KJRI Frankfurt"
        description="Surat Keluar Sistem Aplikasi KJRI Frankfurt"
      />
      <h4>Surat Keluar</h4>
      <SuratKeluarForm />
    </div>
  );
};

export default SuratKeluar;
