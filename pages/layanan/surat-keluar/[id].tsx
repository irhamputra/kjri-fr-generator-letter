import * as React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import SuratKeluarForm from "../../../components/forms/SuratKeluar";

const SuratKeluarId: NextPage = () => {
  const { query = {}, push } = useRouter();

  return (
    <div style={{ marginTop: "5rem" }}>
      <button
        onClick={async () => {
          await push((query?.originUrl as string) ?? "/layanan/surat-keluar/list");
        }}
        className="btn-dark btn my-3"
      >
        Kembali ke list
      </button>

      <div>
        <SuratKeluarForm editId={query.id as string} backUrl={query?.originUrl as string} />
      </div>
    </div>
  );
};

export default SuratKeluarId;
