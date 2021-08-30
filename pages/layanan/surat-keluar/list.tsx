import * as React from "react";
import { NextPage } from "next";
import useQuerySuratKeluar from "../../../hooks/query/useQuerySuratKeluar";
import { useRouter } from "next/router";
import { Printer, Search } from "react-bootstrap-icons";
import Table from "../../../components/Table";
import { useQueryClient } from "react-query";
import { Auth } from "../../../typings/AuthQueryClient";
import toast from "react-hot-toast";
import { SuratKeluarCollection } from "../../../typings/SuratKeluar";
import { useDownloadFile } from "../../../hooks/useDownloadSurat";

const ListSuratKeluar: NextPage = () => {
  const { push } = useRouter();
  const { data: listSuratKeluar, isLoading } = useQuerySuratKeluar();
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  const { mutateAsync } = useDownloadFile();

  const handlePrint = async (url: string) => {
    try {
      await mutateAsync(url);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.error);
    }
  };

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
      {
        Header: "Opsi",
        accessor: "col4",
        Cell: ({ value }: { value: string }) => (
          <div style={{ display: "flex" }}>
            <button
              disabled={!value}
              className={`btn ${!value ? "" : "btn-outline-primary"}`}
              onClick={() => handlePrint(value)}
            >
              <Printer size={25} />
            </button>
          </div>
        ),
      },
    ],

    [query]
  );

  if (isLoading) return <p>Loading...</p>;

  const data = listSuratKeluar?.listSurat.map?.(
    ({ nomorSurat, content, url }: SuratKeluarCollection, index: number) => ({
      col1: index + 1,
      col2: nomorSurat,
      col3: content,
      col4: url,
    })
  );

  return (
    <div style={{ marginTop: "6rem" }} className="mb-5">
      <div className="d-flex justify-content-between">
        <h4>List Surat Keluar</h4>
      </div>

      <div className="col my-3">
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
