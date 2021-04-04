import * as React from "react";
import { NextPage } from "next";
import { Search } from "react-bootstrap-icons";
import { MessageCard } from "../../../components/Card";
import useQuerySuratTugas from "../../../hooks/query/useQuerySuratTugas";
import { useRouter } from "next/router";
import { FileEarmarkExcel } from "react-bootstrap-icons";
import useFuse from "../../../hooks/useFuse";

const ListSurat: NextPage = () => {
  const { push } = useRouter();
  const {
    data: listSuratTugas,
    isLoading: suratTugasLoading,
  } = useQuerySuratTugas();

  const { setSearch, filteredList, searchQuery } = useFuse(listSuratTugas, {
    keys: ["tujuanDinas"],
    includeScore: true,
    loading: suratTugasLoading,
  });

  if (suratTugasLoading) return <p>Loading...</p>;

  return (
    <div className="row">
      <div className="d-flex my-3 align-items-center">
        <h4 className="m-0" style={{ flex: "1 1" }}>
          SPPD yang telah dibuat
        </h4>
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

      <div className="col-12 mb-5 text-end">
        <button
          onClick={async () => await push("/layanan/penugasan")}
          type="button"
          className="btn btn-sm btn-dark ms-3"
        >
          Buat SPD Baru
        </button>
      </div>

      {filteredList && searchQuery.length > 0
        ? filteredList.map((v) => {
            return (
              <div key={v.item.suratTugasId} className="col-4 my-2">
                <MessageCard
                  key={v.item.nomorSurat}
                  title={v.item.tujuanDinas}
                  number={v.item.nomorSurat}
                  messageId={v.item.suratTugasId}
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
        : listSuratTugas?.map?.((v) => {
            return (
              <div key={v.suratTugasId} className="col-4 my-2">
                <MessageCard
                  key={v.nomorSurat}
                  title={v.tujuanDinas}
                  number={v.nomorSurat}
                  messageId={v.suratTugasId}
                />
              </div>
            );
          })}
    </div>
  );
};

export default ListSurat;
