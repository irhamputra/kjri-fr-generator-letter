import * as React from "react";
import Link from "next/link";
import styles from "../styles/Card.module.css";
import { FileEarmark, ThreeDotsVertical as MoreVertIcon } from "react-bootstrap-icons";

import Popup from "./Popup";
import useDeleteSPDMutation from "../hooks/mutation/useDeleteSPDMutation";
import Modal from "react-modal";
import { LegacyRef } from "react";

interface CardProps {
  title: string;
  link: string;
  icon: React.ReactNode;
}

interface CardMessageProps {
  title: string;
  number: number;
  messageId: string;
  type?: "SPD" | "SK";
}

const Card: React.FC<CardProps> = ({ title, link, icon }) => {
  return (
    <Link href={link}>
      <div className="card-body">
        <div
          className={"card " + styles.customCard}
          style={{
            cursor: "pointer",
            minHeight: 240,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
          }}
        >
          <div className="card-img-top d-flex p-3" style={{ justifyContent: "center" }}>
            {icon}
          </div>
          <p className="card-title text-center fw-bold">{title}</p>
        </div>
      </div>
    </Link>
  );
};

const MessageCard: React.FC<CardMessageProps> = ({ title, number, messageId, type = "SPD" }) => {
  const [showOption, setShowOption] = React.useState(false);
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [showMenu, setShowMenu] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { mutateAsync } = useDeleteSPDMutation();

  const baseLink = type === "SPD" ? "/layanan/penugasan/" : "/layanan/surat-keluar/";

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

  const handleDelete = type === "SPD" ? mutateAsync : () => {};

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setShowOption(true)}
      onMouseLeave={() => setShowOption(false)}
    >
      <Link href={"" + messageId} passHref>
        <a>
          <div className="p-3 d-flex " style={{ background: "#f8f8f8" }}>
            <FileEarmark height={48} width={48} style={{ color: "rgba(0,0,0,0.5)" }} />
            <div className="mx-2">
              <small>{number}</small>
              <div style={{ fontWeight: "bold" }}>{title}</div>
            </div>
          </div>
        </a>
      </Link>

      <div className={styles.messageCard} style={{ visibility: showOption || showMenu ? "visible" : "hidden" }}>
        <div ref={setReferenceElement as LegacyRef<HTMLDivElement> | undefined}>
          <MoreVertIcon className={styles.iconMC} onClick={() => setShowMenu(true)} />
        </div>

        <Popup open={showMenu} anchorRef={referenceElement} onClickOutside={() => setShowMenu(false)}>
          <div
            className="p-1"
            style={{
              background: "white",
            }}
          >
            <div className="dropdown-menu-left">
              <Link href={`${baseLink}${messageId}?edit=true`} passHref>
                <a>
                  <button className="dropdown-item" type="button">
                    Edit
                  </button>
                </a>
              </Link>

              <button
                className="dropdown-item"
                type="button"
                onClick={() => {
                  setOpen(true);
                  setShowMenu(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Popup>
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
                  await handleDelete(messageId);
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
    </div>
  );
};

export default Card;
export { MessageCard };
