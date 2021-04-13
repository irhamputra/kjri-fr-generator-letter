import * as React from "react";
import { NextPage } from "next";
import useQuerySuratKeluar from "../../../hooks/query/useQuerySuratKeluar";
import { MessageCard } from "../../../components/Card";
import { useRouter } from "next/router";
import { FileEarmarkExcel, Search } from "react-bootstrap-icons";
import useFuse from "../../../hooks/useFuse";

const ListSuratKeluar: NextPage = () => {
  const { push } = useRouter();
  const { data: listSuratKeluar, isLoading } = useQuerySuratKeluar();

  const { searchQuery, filteredList, setSearch } = useFuse(
    listSuratKeluar?.listSurat,
    {
      keys: ["content"],
      includeScore: true,
      loading: isLoading,
    }
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between">
        <h4>List Surat Keluar</h4>

        <div className="input-group w-25">
          <span className="input-group-text" id="durasi-hari">
            <Search />
          </span>
          <input
            className="form-control"
            type="text"
            placeholder="Telusuri surat..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

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
        {filteredList && searchQuery.length > 0
          ? filteredList.map((v) => {
              return (
                <div key={v.item.id} className="col-md-4 col-sm-6 my-2">
                  <MessageCard
                    key={v.item.id}
                    title={v.item.content}
                    number={v.item.nomorSurat}
                    messageId={v.item.id}
                    type="SK"
                  />
                </div>
              );
            })
          : null}

        {filteredList.length <= 0 && searchQuery.length > 0 ? (
          <div className="my-5">
            <div className="my-5 text-center">
              <FileEarmarkExcel size={50} />
              <h5 className="mt-3">
                Surat <strong>"{searchQuery}"</strong> Tidak ditemukan! Mohon
                gunakan kata kunci dengan benar.
              </h5>
            </div>
          </div>
        ) : null}

        {searchQuery.length > 0
          ? null
          : listSuratKeluar?.listSurat?.map((v) => {
              return (
                <div key={v.id} className="col-md-4 col-sm-6 my-2">
                  <MessageCard
                    key={v.id}
                    title={v.content}
                    number={v.nomorSurat}
                    messageId={v.id}
                    type="SK"
                  />
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default ListSuratKeluar;
