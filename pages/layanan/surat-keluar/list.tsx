import * as React from "react";
import { NextPage } from "next";
import useQuerySuratKeluar from "../../../hooks/query/useQuerySuratKeluar";
import { useRouter } from "next/router";
import { Search } from "react-bootstrap-icons";
import Table from "../../../components/Table";
import useDeleteSuratKeluar from "../../../hooks/mutation/useDeleteSuratKeluar";
import ReactModal from "react-modal";
import Link from "next/link";
import { useQueryClient } from "react-query";
import { Auth } from "../../../typings/AuthQueryClient";

type CellValue = {
  id: string;
  author: string | undefined;
};

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
      {
        Header: "Opsi",
        accessor: "col4",
        Cell: ({ value }: { value: CellValue }) => {
          if (query?.isAdmin) {
            return (
              <div className="d-flex">
                <Link href={`/layanan/surat-keluar/${value.id}?edit=true`} passHref>
                  <a>Ubah</a>
                </Link>
                <DeleteAction messageId={value.id} />
              </div>
            );
          }

          if (value.author === query?.email) {
            return (
              <div className="d-flex">
                <Link href={`/layanan/surat-keluar/${value.id}?edit=true`} passHref>
                  <a>Ubah</a>
                </Link>
                <DeleteAction messageId={value.id} />
              </div>
            );
          }

          return null;
        },
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
      col4: { id, author },
    })
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="mt-3">
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

const DeleteAction = ({ messageId }: { messageId: string }): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const { mutateAsync } = useDeleteSuratKeluar();

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
      <ReactModal isOpen={open} onRequestClose={() => setOpen(false)} style={customStyles}>
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
      </ReactModal>
    </>
  );
};

export default ListSuratKeluar;
