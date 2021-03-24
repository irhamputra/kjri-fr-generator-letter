import * as React from "react";
import { NextPage } from "next";
import { Search } from "react-bootstrap-icons";
import { MessageCard } from "../../../components/Card";
import useQuerySuratTugas from "../../../hooks/query/useQuerySuratTugas";
import Fuse from "fuse.js";
import { useRouter } from "next/router";

const ListSurat: NextPage = () => {
  const [searchQuery, setSearch] = React.useState("");
  const [filteredList, setFilteredList] = React.useState([]);
  const { push } = useRouter();

  const {
    data: listSuratTugas,
    isLoading: suratTugasLoading,
  } = useQuerySuratTugas();

  const search = (query) => {
    const fuse = new Fuse(listSuratTugas, {
      keys: ["tujuanDinas"],
      includeScore: true,
    });

    const res = fuse.search(query);
    setFilteredList(res);
  };

  React.useEffect(() => {
    listSuratTugas && searchQuery.length > 1 && search(searchQuery);
  }, [searchQuery, suratTugasLoading]);

  return (
    <div className="row mt-3">
      <div className="d-flex">
        <h4 className="mb-3" style={{ flex: "1 1" }}>
          SPPD yang telah dibuat
        </h4>
        <div className="input-group" style={{ maxWidth: 200 }}>
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

      <div className="my-3">
        <button
          onClick={async () => await push("/layanan/penugasan")}
          type="button"
          className="btn btn-primary"
        >
          Buat SPD Baru
        </button>
      </div>
      {suratTugasLoading ? <p>Loading...</p> : null}
      {filteredList && searchQuery.length > 0
        ? filteredList.map((v) => {
            return (
              <div key={v.item.suratTugasId} className="col-4">
                <MessageCard
                  key={v.item.nomorSurat}
                  title={v.item.tujuanDinas}
                  number={v.item.nomorSurat}
                  link={`/layanan/penugasan/${v.item.suratTugasId}`}
                />
              </div>
            );
          })
        : null}
      {searchQuery.length > 0
        ? null
        : listSuratTugas?.map?.((v) => {
            return (
              <div key={v.suratTugasId} className="col-4">
                <MessageCard
                  key={v.nomorSurat}
                  title={v.tujuanDinas}
                  number={v.nomorSurat}
                  link={`/layanan/penugasan/${v.suratTugasId}`}
                />
              </div>
            );
          })}
    </div>
  );
};

export default ListSurat;
