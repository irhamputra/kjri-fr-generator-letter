import * as React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import SuratKeluarForm from "../../../components/forms/SuratKeluar";
import { useQuerySuratKeluarById } from "../../../hooks/query/useQuerySuratKeluar";

const SuratKeluarId: NextPage = () => {
  const { query = {}, push } = useRouter();

  const { data = {}, isLoading } = useQuerySuratKeluarById(query.id as string);

  if (isLoading) return <h4>Loading...</h4>;

  return (
    <>
      <button
        onClick={async () => {
          await push((query?.originUrl as string) ?? "/layanan/surat-keluar/list");
        }}
        className="btn-dark btn my-3"
      >
        Kembali ke list
      </button>

      <div>
        <h4>Nomor Surat</h4>
        <p>{data.nomorSurat}</p>
      </div>
      <div>
        <SuratKeluarForm editId={query.id as string} backUrl={query?.originUrl as string} />
      </div>
    </>
  );
};

export default SuratKeluarId;
