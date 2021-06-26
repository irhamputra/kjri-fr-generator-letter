import * as React from "react";
import { NextPage } from "next";
import useQuerySuratKeluar from "../../../hooks/query/useQuerySuratKeluar";
import { useRouter } from "next/router";
import { Search } from "react-bootstrap-icons";
import Table from "../../../components/Table";
import { useQueryClient } from "react-query";
import { Auth } from "../../../typings/AuthQueryClient";

const ListSuratKeluar: NextPage = () => {
  const { push } = useRouter();
  const { data: listSuratKeluar, isLoading } = useQuerySuratKeluar();
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Nomor Surat",
        accessor: "col2", // accessor is the "key" in the data
      },
      {
        Header: "Tujuan Dinas",
        accessor: "col3",
      },
    ],
    [query]
  );

  const data = listSuratKeluar?.listSurat.map?.(
    (
      { nomorSurat, content, id, author }: { nomorSurat: string; content: string; id: string; author: string },
      index: number
    ) => ({
      col1: index + 1,
      col2: nomorSurat,
      col3: content,
    })
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ marginTop: "6rem" }}>
      <div className="d-flex justify-content-between">
        <h4>List Surat Keluar</h4>
      </div>

      <div className="col mt-3">
        <Table
          columns={columns}
          data={data}
          search={({ setGlobalFilter }: { setGlobalFilter: Function }) => {
            return (
              <div className="d-flex w-100 justify-content-between mb-3">
                <div className="input-group w-25">
                  <span className="input-group-text" id="durasi-hari">
                    <Search />
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Telusuri surat..."
                    onChange={(e) => setGlobalFilter(e.target.value)}
                  />
                </div>

                <button
                  onClick={async () => await push("/layanan/surat-keluar")}
                  type="button"
                  className="btn btn-sm btn-dark"
                >
                  Buat Surat Keluar Baru
                </button>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default ListSuratKeluar;
