import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { House, Gear } from "react-bootstrap-icons";

const Sidebar: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const { pathname } = useRouter();

  const isActive = pathname === "/pengaturan";

  return (
    <div className="col-2">
      <nav className="p-3">
        <Link href="/dashboard">
          <a>
            <h4 className="my-0">KJRI Frankfurt</h4>
          </a>
        </Link>
      </nav>
      <ul className="list-group mt-4 list-group-flush">
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
              isActive ? "text-primary list-group-item" : "list-group-item"
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
