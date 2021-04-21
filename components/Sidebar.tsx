import * as React from "react";
import Link from "next/link";
import { House, Gear, FileEarmarkCheck, FileEarmarkPerson } from "react-bootstrap-icons";
import { useQueryClient } from "react-query";
import type { Auth } from "../typings/AuthQueryClient";
import useQueryTotalSuratPerjalanan from "../hooks/query/useQueryTotalSuratPerjalanan";

const Sidebar = (): JSX.Element => {
  const { data, isLoading } = useQueryTotalSuratPerjalanan();
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  if (isLoading) return <div />;

  return (
    <div
      className={`col-2 bg-dark`}
      style={{ height: "100vh", position: "fixed" }}
    >
      <nav className="p-1">
        <div className="p-3 d-flex" style={{ justifyContent: "center" }}>
          <Link href="/dashboard">
            <a>
              <h4 className="my-0 text-white">KJRI Frankfurt</h4>
            </a>
          </Link>
        </div>

        <ul className="list-group mt-4 list-group-flush">
          <li className="list-group-item text-white bg-transparent" style={{ borderColor: "#ffffff20" }}>
            <Link href="/dashboard">
              <a className="d-flex align-items-center p-2">
                <House size={25} style={{ color: "white" }} />
                <p className="my-0 mx-2 ">Dashboard</p>
              </a>
            </Link>
          </li>

          <li className="list-group-item text-white bg-transparent" style={{ borderColor: "#ffffff20" }}>
            <Link href="/created-surat">
              <a className="d-flex align-items-center p-2">
                <FileEarmarkCheck size={25} style={{ color: "white" }} />
                <p className="my-0 mx-2 ">Surat Telah Dibuat</p>
              </a>
            </Link>
          </li>

          <li className="list-group-item text-white bg-transparent" style={{ borderColor: "#ffffff20" }}>
            <Link href="/surat-perjalanan">
              <a className="d-flex align-items-center p-2">
                <FileEarmarkPerson size={25} style={{ color: "white" }} />
                <p className="my-0 mx-2 ">Surat Perjalanan</p>
                {data > 0 && (
                  <span className="badge badge-danger" style={{ background: "#dc3545" }}>
                    {data}
                  </span>
                )}
              </a>
            </Link>
          </li>

          {query?.isAdmin && (
            <li className="list-group-item text-white bg-transparent">
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
