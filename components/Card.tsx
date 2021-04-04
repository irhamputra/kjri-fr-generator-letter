import * as React from "react";
import Link from "next/link";
import styles from "../styles/Card.module.css";
import {
  FileEarmark,
  ThreeDotsVertical as MoreVertIcon,
} from "react-bootstrap-icons";

import { usePopper } from "react-popper";
import Popup from "./Popup";

interface CardProps {
  title: string;
  link: string;
  icon: React.ReactNode;
}

interface CardMessageProps {
  title: string;
  number: number;
  messageId: string;
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
          <div
            className="card-img-top d-flex p-3"
            style={{ justifyContent: "center" }}
          >
            {icon}
          </div>
          <p className="card-title text-center fw-bold">{title}</p>
        </div>
      </div>
    </Link>
  );
};

const MessageCard: React.FC<CardMessageProps> = ({
  title,
  number,
  messageId,
}) => {
  const [showOption, setShowOption] = React.useState(false);
  const [referenceElement, setReferenceElement] = React.useState(null);

  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setShowOption(true)}
      onMouseLeave={() => setShowOption(false)}
    >
      <Link href={"/layanan/penugasan/" + messageId} passHref>
        <a>
          <div className="p-3 d-flex " style={{ background: "#f8f8f8" }}>
            <FileEarmark
              height={48}
              width={48}
              style={{ color: "rgba(0,0,0,0.5)" }}
            />
            <div className="mx-2">
              <small>{number}</small>
              <div style={{ fontWeight: "bold" }}>{title}</div>
            </div>
          </div>
        </a>
      </Link>

      <div
        className={styles.messageCard}
        style={{ visibility: showOption || showMenu ? "visible" : "hidden" }}
      >
        <div ref={setReferenceElement}>
          <MoreVertIcon
            className={styles.iconMC}
            onClick={() => setShowMenu(true)}
          />
        </div>

        <Popup
          open={showMenu}
          anchorRef={referenceElement}
          onClickOutside={() => setShowMenu(false)}
        >
          <div
            className="p-1"
            style={{
              background: "white",
            }}
          >
            <div className="dropdown-menu-left">
              <Link href={`/layanan/penugasan/${messageId}?edit=true`} passHref>
                <a>
                  <button className="dropdown-item" type="button">
                    Edit
                  </button>
                </a>
              </Link>

              <button className="dropdown-item" type="button">
                Delete
              </button>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
};

export default Card;
export { MessageCard };
