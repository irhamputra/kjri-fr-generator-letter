import * as React from "react";
import { NextPage } from "next";
import { Search } from "react-bootstrap-icons";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "react-modal";
import { PropsWithChildren } from "react";
import Table from "../../../components/Table";
import useDeleteSPDMutation from "../../../hooks/mutation/useDeleteSPDMutation";
import useQuerySuratTugas from "../../../hooks/query/useQuerySuratTugas";

type SuratTugas = { nomorSurat: string; tujuanDinas: string; suratTugasId: string };

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
        Cell: ({ value }: { value: string }) => (
          <div style={{ display: "flex" }}>
            <Link href={`/layanan/penugasan/${value}?edit=true`} passHref>
              <a>Edit</a>
            </Link>
            <DeleteAction messageId={value} />
          </div>
        ),
      },
    ],
    []
  );

  const data = listSuratTugas?.map?.(({ nomorSurat, tujuanDinas, suratTugasId }: SuratTugas, index: number) => ({
    col1: index + 1,
    col2: nomorSurat,
    col3: tujuanDinas,
    col4: suratTugasId,
  }));

  if (suratTugasLoading) return <p>Loading...</p>;

  return (
    <div className="row">
      <div className="d-flex align-items-center mb-3" style={{ marginTop: "6rem" }}>
        <h4 className="m-0" style={{ flex: "1 1" }}>
          SPPD yang telah dibuat
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

const DeleteAction = ({ messageId }: PropsWithChildren<{ messageId: string }>): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const { mutateAsync } = useDeleteSPDMutation();

  return (
    <>
      <div
        style={{ marginLeft: 24, cursor: "pointer" }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <a href="#">Delete</a>
      </div>
      <Modal isOpen={open} onRequestClose={() => setOpen(false)} contentLabel="Example Modal" style={customStyles}>
        <div className="modal-dialog" role="document" style={{ width: "100vw" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Hapus SPPD?</h5>
            </div>
            <div className="modal-body">
              <p>Kamu tidak akan bisa mengembalikan surat yang telah dihapus.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  await mutateAsync(messageId);
                  setOpen(false);
                }}
              >
                Hapus
              </button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ListSurat;
