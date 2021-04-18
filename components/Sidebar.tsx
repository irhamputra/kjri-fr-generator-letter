import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { House, Gear } from "react-bootstrap-icons";
import styles from "../styles/Sidebar.module.css";
import { useAuthContext } from "../context/AuthContext";

const Sidebar: React.FC = () => {
  const { pathname } = useRouter();
  const {
    data: { isAdmin },
  } = useAuthContext();

  const isActive = pathname === "/pengaturan";

  return (
    <div className={`col-2 bg-dark`} style={{ height: "100vh" }}>
      <nav className="p-1">
        <div className="p-3 d-flex" style={{ justifyContent: "center" }}>
          <Link href="/dashboard">
            <a>
              <h4 className="my-0 text-white">KJRI Frankfurt</h4>
            </a>
          </Link>
        </div>

        <ul className="list-group mt-4 list-group-flush">
          <li className={`list-group-item text-white ${styles.groupItem}`} style={{ borderColor: "#ffffff20" }}>
            <Link href="/dashboard">
              <a className="d-flex align-items-center p-2">
                <House size={25} style={{ color: "white" }} />
                <p className="my-0 mx-2 ">Dashboard</p>
              </a>
            </Link>
          </li>

          {isAdmin && (
            <li
              className={`${
                isActive
                  ? `list-group-item text-primary ${styles.groupItem}`
                  : `list-group-item text-white ${styles.groupItem}`
              }`}
            >
              <Link href="/pengaturan">
                <a className="d-flex align-items-center p-2">
                  <Gear size={25} />
                  <p className="my-0 mx-2">Pengaturan</p>
                </a>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
