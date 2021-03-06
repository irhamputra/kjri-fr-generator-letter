import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import sleep from "../../utils/sleep";

const DashboardLayout: React.FC = ({ children }) => {
  const { replace } = useRouter();

  const handleLogout = async () => {
    try {
      await sleep(1500);
      await replace("/login");
    } catch (e) {}
  };

  return (
    <>
      <button onClick={handleLogout} type="button">
        Logout
      </button>

      {children}

      <div>
        <Link href="/dashboard/spd">
          <a>Surat Perjalanan Dinas (SPD)</a>
        </Link>
      </div>

      <div>
        <Link href="/dashboard/sppd">
          <a>Surat Perjalanan Perjalanan Dinas (SPPD)</a>
        </Link>
      </div>
    </>
  );
};

export default DashboardLayout;
