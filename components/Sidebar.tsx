import * as React from "react";
import Link, { LinkProps } from "next/link";
import { House, Gear, FileEarmarkCheck } from "react-bootstrap-icons";
import { useQueryClient } from "react-query";
import type { Auth } from "../typings/AuthQueryClient";
import useQuerySuratDibuat from "../hooks/query/useQuerySuratDibuat";
import { useAppState } from "../contexts/app-state-context";
import Modal from "react-modal";
import { useRouter } from "next/router";

const Sidebar = (): JSX.Element => {
  const { data: dataSuratDibuat, isLoading: isLoadingSuratDibuat } = useQuerySuratDibuat();
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  return (
    <div className="col-2 bg-dark" style={{ height: "100vh", position: "fixed", zIndex: 9999 }}>
      <nav className="p-1">
        <div className="p-3 d-flex" style={{ justifyContent: "center" }}>
          <LinkWithEditPrompt href="/dashboard">
            <h4 className="my-0 text-white">KJRI Frankfurt</h4>
          </LinkWithEditPrompt>
        </div>

        <ul className="list-group mt-4 list-group-flush">
          <li className="list-group-item text-white bg-transparent" style={{ borderColor: "#ffffff20" }}>
            <LinkWithEditPrompt href="/dashboard">
              <House size={25} style={{ color: "white" }} />
              <p className="my-0 mx-2 ">Dashboard</p>
            </LinkWithEditPrompt>
          </li>

          <li className="list-group-item text-white bg-transparent" style={{ borderColor: "#ffffff20" }}>
            <LinkWithEditPrompt href="/created-surat">
              <FileEarmarkCheck size={25} style={{ color: "white" }} />
              <p className="my-0 mx-2 ">Surat Keluarku</p>
              {!isLoadingSuratDibuat && dataSuratDibuat.length > 0 && (
                <span className="badge badge-danger" style={{ background: "#dc3545" }}>
                  {dataSuratDibuat.length}
                </span>
              )}
            </LinkWithEditPrompt>
          </li>

          {query?.isAdmin && (
            <li className="list-group-item text-white bg-transparent">
              <LinkWithEditPrompt href="/pengaturan">
                <Gear size={25} />
                <p className="my-0 mx-2">Pengaturan</p>
              </LinkWithEditPrompt>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

const LinkWithEditPrompt: React.FC<LinkProps> = ({ children, href, ...props }) => {
  const {
    dispatch,
    state: { isEditing },
  } = useAppState();

  const { push } = useRouter();

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

  const [isOpenModal, setIsOpenModal] = React.useState(false);

  return (
    <>
      <Modal
        isOpen={isOpenModal}
        onRequestClose={() => setIsOpenModal(false)}
        contentLabel="User Registration Modal"
        style={customStyles}
      >
        <div className="modal-dialog" role="document" style={{ width: "100vw" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Perubahan yang belum disimpan</h5>
            </div>
            <div className="modal-body">
              Anda akan meninggalkan halaman ini tanpa menyimpan perubahan. Apakah anda yakin?
            </div>
            <div className="modal-footer">
              <button className="btn-text btn" type="submit" onClick={() => setIsOpenModal(false)}>
                Batalkan
              </button>
              <button
                className="btn-dark btn"
                type="submit"
                onClick={() => {
                  dispatch({ type: "setIsEditing", payload: false });
                  setIsOpenModal(false);
                  push(href);
                }}
              >
                Tinggalkan halaman
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Link href={href} {...props}>
        <a
          onClick={(e) => {
            if (isEditing) {
              e.preventDefault();
              setIsOpenModal(true);
            }
          }}
          className="d-flex align-items-center p-2"
        >
          {children}
        </a>
      </Link>
    </>
  );
};

export default Sidebar;
