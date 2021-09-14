import * as React from "react";
import Link from "next/link";
import styles from "../styles/Card.module.css";

interface CardProps {
  title: string;
  link: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, link, icon, onClick }) => {
  return (
    <>
      {onClick ? (
        <div onClick={onClick} className="card-body">
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
      ) : (
        <Link href={link}>
          <a>
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
          </a>
        </Link>
      )}
    </>
  );
};

export default Card;
