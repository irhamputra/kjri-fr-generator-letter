import { NextPage } from "next";
import useQuerySuratPerjalanan from "../../hooks/query/useQuerySuratPerjalanan";
import { NextSeo } from "next-seo";
import * as React from "react";
import { Eye, Printer, Search } from "react-bootstrap-icons";
import Link from "next/link";
import Table from "../../components/Table";

const SuratPerjalanan: NextPage = () => {
  const { data: listSuratPerjalanan, isLoading } = useQuerySuratPerjalanan();

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
            <Link href={`/layanan/penugasan/${value}`} passHref>
              <a>
                <button type="button" className="btn btn-primary" style={{ marginRight: 16 }} data-dismiss="modal">
                  <Eye size={25} />
                </button>
              </a>
            </Link>

            <button className="btn btn-outline-primary" onClick={() => handlePrint(value)}>
              <Printer size={25} />
            </button>

            {/* <DeleteAction messageId={value} /> */}
          </div>
        ),
      },
    ],
    []
  );

  const data = listSuratPerjalanan?.map?.(
    (
      { nomorSurat, tujuanDinas, suratTugasId }: { nomorSurat: string; tujuanDinas: string; suratTugasId: string },
      index: number
    ) => ({
      col1: index + 1,
      col2: nomorSurat,
      col3: tujuanDinas,
      col4: suratTugasId,
    })
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <NextSeo
        title="Surat Perjalanan | Sistem Aplikasi KJRI Frankfurt"
        description="Dashboard Arsip Sistem Aplikasi KJRI Frankfurt"
      />
      <section style={{ marginTop: "6rem" }}>
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
        {/* <ul>
          {data?.map?.((v: SuratPerjalanan) => {
            return (
              <li key={v.suratTugasId}>
                {v.suratTugasId}
                <button className="btn btn-outline-primary" onClick={() => handlePrint(v.suratTugasId)}>
                  <Printer size={25} />
                </button>
              </li>
            );
          })}
        </ul> */}
      </section>
    </>
  );
};

export default SuratPerjalanan;
