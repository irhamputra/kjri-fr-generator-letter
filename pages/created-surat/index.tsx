import { NextPage } from "next";
import { NextSeo } from "next-seo";
import * as React from "react";
import { Pencil, Printer, Search } from "react-bootstrap-icons";
import Link from "next/link";
import Table from "../../components/Table";
import useQuerySuratDibuat from "../../hooks/query/useQuerySuratDibuat";

const SuratDibuat: NextPage = () => {
  const { data: suratDibuat = [], isLoading } = useQuerySuratDibuat();

  const handlePrint = async (id: string) => {
    console.log({ id });
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
            <Link href={`/layanan/surat-keluar/${value}?edit=true&originUrl=/created-surat`} passHref>
              <a>
                <button type="button" className="btn btn-primary" style={{ marginRight: 16 }} data-dismiss="modal">
                  <Pencil size={25} />
                </button>
              </a>
            </Link>

            <button className="btn btn-outline-primary" onClick={() => handlePrint(value)}>
              <Printer size={25} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const data = suratDibuat?.map?.(
    ({ nomorSurat, content, id }: { nomorSurat: string; content: string; id: string }, index: number) => ({
      col1: index + 1,
      col2: nomorSurat,
      col3: content,
      col4: id,
    })
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <NextSeo
        title="Surat Perjalanan | Sistem Aplikasi KJRI Frankfurt"
        description="Dashboard Arsip Sistem Aplikasi KJRI Frankfurt"
      />
      <section className="mt-3">
        <div className="mb-3">
          <h3>List Surat Perjalanan</h3>
        </div>
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
              </div>
            );
          }}
        />
      </section>
    </>
  );
};

export default SuratDibuat;
