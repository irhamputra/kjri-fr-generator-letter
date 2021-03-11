import * as React from "react";
import Link from "next/link";

interface CardProps {
  title: string;
  subtitle: string;
  content: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, content, link, subtitle }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{subtitle}</h6>
        <p className="card-text">{content}</p>
        <Link href={`/dashboard/${link}`}>{link}</Link>
      </div>
    </div>
  );
};

export default Card;
