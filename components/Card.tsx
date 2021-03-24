import * as React from "react";
import Link from "next/link";
import styles from "../styles/Card.module.css";
import { FileEarmark } from "react-bootstrap-icons";

interface CardProps {
  title: string;
  link: string;
  icon: React.ReactNode;
}

interface CardMessageProps {
  title: string;
  link: string;
  number: number;
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

const MessageCard: React.FC<CardMessageProps> = ({ link, title, number }) => {
  return (
    <Link href={link} passHref>
      <a>
        <div className="p-3 d-flex" style={{ background: "#f8f8f8" }}>
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
  );
};

export default Card;
export { MessageCard };
