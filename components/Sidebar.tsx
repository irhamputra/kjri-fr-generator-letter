import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { House, Gear } from "react-bootstrap-icons";

const Sidebar: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const { pathname } = useRouter();

  const isActive = pathname === "/pengaturan";

  return (
    <div className="col-2 mt-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <Link href="/dashboard">
            <a className="d-flex align-items-center">
              <House size={25} />
              <p className="my-0 mx-2">Dashboard</p>
            </a>
          </Link>
        </li>

        {isAdmin && (
          <li
            className={`${
              isActive
                ? "text-primary list-group-item mt-5"
                : "list-group-item mt-5"
            }`}
          >
            <Link href="/pengaturan">
              <a className="d-flex align-items-center">
                <Gear size={25} />
                <p className="my-0 mx-2">Pengaturan</p>
              </a>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
