import * as React from "react";
import Link from "next/link";
import { ArrowLeftShort } from "react-bootstrap-icons";

const BackToDashboard: React.FC = () => (
  <Link href="/">
    <a className="align-items-center mt-5 d-flex">
      <ArrowLeftShort size={25} />
      <p className="m-0">Kembali ke Login</p>
    </a>
  </Link>
);

export default BackToDashboard;
