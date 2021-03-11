import * as React from "react";
import Link from "next/link";

const Sidebar: React.FC = () => {
  const links = React.useMemo(
    () => [
      {
        pathname: "Surat Keluar",
      },
      {
        pathname: "Nota Internal",
      },
      {
        pathname: "Surat Keputusan",
      },
      {
        pathname: "Surat Tugas",
      },
    ],
    []
  );
  return (
    <div className="col-2 mt-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className="list-group-item mt-3">
          <h5>Layanan</h5>
        </li>
        {links.map(({ pathname }, i) => (
          <li key={i} className="list-group-item">
            <Link
              href={`/dashboard/${pathname.toLowerCase().replace(" ", "-")}`}
            >
              {pathname}
            </Link>
          </li>
        ))}

        <li className="list-group-item mt-5">
          <Link href="/pengaturan">Pengaturan</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
