import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar: React.FC = () => {
  const { pathname } = useRouter();

  const isActive = pathname === "/pengaturan";

  return (
    <div className="col-2 mt-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <Link href="/dashboard">🏠 &nbsp; Dashboard</Link>
        </li>
        <li
          className={`${
            isActive
              ? "text-primary list-group-item mt-5"
              : "list-group-item mt-5"
          }`}
        >
          <Link href="/pengaturan">⚙️ &nbsp; Pengaturan</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
