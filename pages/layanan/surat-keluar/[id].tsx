import * as React from "react";
import { NextPage } from "next";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import axios from "axios";

const SuratKeluarId: NextPage = () => {
  const { query, push } = useRouter();

  const { data, isLoading } = useQuery(
    ["fetchSuratKeluarId", query.id],
    async () => {
      const { data } = await axios.get(`/api/v1/surat-keluar/${query.id}`);

      return data;
    }
  );

  if (isLoading) return <h4>Loading...</h4>;

  return (
    <>
      <button
        onClick={async () => {
          await push("/layanan/surat-keluar/list");
        }}
        className="btn-dark btn my-3"
      >
        Kembali ke list
      </button>

      <div>
        <h4>Nomor Surat</h4>
        <p>{data.nomorSurat}</p>
      </div>
    </>
  );
};

export default SuratKeluarId;
