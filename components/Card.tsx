import * as React from "react";
import Link from "next/link";

interface CardProps {
  title: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, link }) => {
  return (
    <Link href={`/layanan/${link}`}>
      <div className="card" style={{ cursor: "pointer" }}>
        <div className="card-body">
          <p className="card-title text-center fw-bold">{title}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
