import { NextPage } from "next";
import useQuerySuratPerjalanan from "../../hooks/query/useQuerySuratPerjalanan";
import { NextSeo } from "next-seo";
import * as React from "react";
import { Eye, Printer, Search } from "react-bootstrap-icons";
import Link from "next/link";
import Table from "../../components/Table";
import Modal from "react-modal";

import { useDownloadSuratPenugasan, useDownloadSuratTugas } from "../../hooks/useDownloadSurat";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "0px",
  },
};

const SuratPerjalanan: NextPage = () => {
  const { data: listSuratPerjalanan, isLoading } = useQuerySuratPerjalanan();

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
            <ButtonPrint suratTugasId={value} />
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
      </section>
    </>
  );
};

const ButtonPrint: React.FC<{ suratTugasId: string }> = ({ suratTugasId }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const { mutateAsync: mutateSuratTugas, isLoading: isLoadingSuratTugas } = useDownloadSuratTugas();
  const { mutateAsync: mutateSuratPenugasan, isLoading: isLoadingSuratPenugasan } = useDownloadSuratPenugasan();

  const handleSuratTugas = async () => {
    await mutateSuratTugas(suratTugasId);
  };

  const handleSuratPenugasan = async () => {
    await mutateSuratPenugasan(suratTugasId);
  };
  return (
    <>
      <button
        className="btn btn-outline-primary"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <Printer size={25} />
      </button>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="User Registration Modal"
        style={customStyles}
      >
        <div className="modal-dialog" role="document" style={{ width: "100vw" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Download Surat</h5>
            </div>
            <div className="modal-body">
              <div className="d-flex mb-2">
                <div style={{ flex: "1 1" }}>Surat Tugas</div>
                <div style={{ flex: "1 1" }}>
                  {!isLoadingSuratTugas ? (
                    <a href="#" onClick={handleSuratTugas}>
                      Download
                    </a>
                  ) : (
                    <span>Downloading...</span>
                  )}
                </div>
              </div>
              <div className="d-flex">
                <div style={{ flex: "1 1" }}>Surat Penugasan</div>
                <div style={{ flex: "1 1" }}>
                  {!isLoadingSuratPenugasan ? (
                    <a href="#" onClick={handleSuratPenugasan}>
                      Download
                    </a>
                  ) : (
                    <span>Downloading...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SuratPerjalanan;
