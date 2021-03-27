import * as React from "react";
import { NextPage } from "next";
import useQuerySuratKeluar from "../../../hooks/query/useQuerySuratKeluar";
import { MessageCard } from "../../../components/Card";
import { useRouter } from "next/router";

const ListSuratKeluar: NextPage = () => {
  const { push } = useRouter();
  const { data: listSuratKeluar, isLoading } = useQuerySuratKeluar();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="mt-3">
      <h4>List Surat Keluar</h4>
      <button
        type="button"
        className="btn btn-dark btn-sm mt-2 mb-3"
        onClick={async () => {
          await push("/layanan/surat-keluar");
        }}
      >
        Buat Surat Keluar
      </button>
      <div className="row">
        {listSuratKeluar?.listSurat?.map((v) => {
          return (
            <div key={v.id} className="col-4 my-2">
              <MessageCard
                key={v.id}
                title={v.content}
                number={v.nomorSurat}
                link={`/layanan/surat-keluar/${v.id}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListSuratKeluar;
