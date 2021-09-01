import * as React from "react";
import { NextPage } from "next";
import { Eye, Pencil, Printer, Search } from "react-bootstrap-icons";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "react-modal";
import Table from "../../../components/Table";
import useQuerySuratTugas from "../../../hooks/query/useQuerySuratTugas";
import { useDownloadSuratPenugasan, useDownloadSuratTugas } from "../../../hooks/useDownloadSurat";
import { SuratTugasRes } from "../../../typings/SuratTugas";
import { Pegawai } from "../../../typings/Pegawai";

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

const ListSurat: NextPage = () => {
  const { push } = useRouter();
  const { data: listSuratTugas, isLoading: suratTugasLoading } = useQuerySuratTugas();

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
        Cell: ({ value }: { value: Pick<SuratTugasRes, "listPegawai" | "suratTugasId" | "downloadUrl"> }) => {
          const listPegawai = value.listPegawai?.map(({ pegawai }) => pegawai) as Pegawai[];
          return (
            <div style={{ display: "flex" }}>
              <Link href={`/layanan/penugasan/${value.suratTugasId}`} passHref>
                <a>
                  <button type="button" className="btn btn-primary" style={{ marginRight: 16 }} data-dismiss="modal">
                    <Eye size={25} />
                  </button>
                </a>
              </Link>
              <Link href={`/layanan/penugasan/${value.suratTugasId}?edit=true`} passHref>
                <a>
                  <button type="button" className="btn btn-primary" style={{ marginRight: 16 }} data-dismiss="modal">
                    <Pencil size={25} />
                  </button>
                </a>
              </Link>
              <ButtonPrint
                suratTugasId={value.suratTugasId as string}
                pegawai={listPegawai}
                downloadUrl={value.downloadUrl}
              />
            </div>
          );
        },
      },
    ],
    []
  );

  if (suratTugasLoading) return <p>Loading...</p>;

  const data =
    listSuratTugas?.map?.(
      ({ nomorSurat, tujuanDinas, suratTugasId, listPegawai, downloadUrl }: SuratTugasRes, index: number) => ({
        col1: index + 1,
        col2: nomorSurat,
        col3: tujuanDinas,
        col4: { suratTugasId, listPegawai, downloadUrl: downloadUrl },
      })
    ) ?? [];

  return (
    <div className="row mb-5">
      <div className="d-flex align-items-center mb-3" style={{ marginTop: "6rem" }}>
        <h4 className="m-0" style={{ flex: "1 1" }}>
          ST yang telah dibuat
        </h4>
      </div>

      <div className="col">
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
                  onClick={async () => await push("/layanan/penugasan")}
                  type="button"
                  className="btn btn-sm btn-dark"
                >
                  Buat SPD Baru
                </button>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

const ButtonPrint: React.FC<Pick<SuratTugasRes, "suratTugasId" | "downloadUrl"> & { pegawai: Pegawai[] }> = ({
  suratTugasId,
  pegawai,
  downloadUrl,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const { mutateAsync: mutateSuratTugas, isLoading: isLoadingSuratTugas } = useDownloadSuratTugas();
  const {
    mutateAsync: mutateSuratPenugasan,
    isLoading: isLoadingSuratPenugasan,
    downloadUid,
  } = useDownloadSuratPenugasan();

  const handleSuratTugas = async (forceRecreate: boolean = false) => {
    await mutateSuratTugas({ suratTugasId, forceRecreate });
  };

  const handleSuratPenugasan = async (suratTugasId: string, uid: string, forceRecreate: boolean) => {
    await mutateSuratPenugasan({ suratTugasId, uid, forceRecreate });
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
              <div className="mb-2">
                <h5>Surat Tugas</h5>
              </div>
              <div className="d-flex mb-4">
                <div style={{ flex: "1 1" }}>Surat Tugas</div>
                <div style={{ flex: "1 1" }}>
                  {!isLoadingSuratTugas ? (
                    <div className="d-flex">
                      <span style={{ cursor: "pointer" }} onClick={() => handleSuratTugas()}>
                        Download
                      </span>
                    </div>
                  ) : (
                    <span>Downloading...</span>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <h5>Surat Penugasan</h5>
              </div>

              {pegawai?.map(({ uid, displayName }) => {
                const canRecreate = downloadUrl?.suratPenugasan?.[uid];

                return (
                  <div className="d-flex mb-2">
                    <div style={{ flex: "1 1" }}>Surat Penugasan {displayName}</div>
                    <div style={{ flex: "1 1" }}>
                      {isLoadingSuratPenugasan && uid === downloadUid ? (
                        <span>Downloading...</span>
                      ) : (
                        <div className="d-flex">
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSuratPenugasan(suratTugasId, uid, false)}
                          >
                            Download
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ListSurat;
