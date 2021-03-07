import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import cookie from "js-cookie";
import { toast } from "react-hot-toast";

const DashboardLayout: React.FC = ({ children }) => {
  const { replace } = useRouter();

  const handleLogout = async () => {
    try {
      const cookies = cookie.get("KJRIFR-U");
      const value = JSON.parse(cookies ?? "");

      const { data } = await axios.post("/api/v1/logout", {
        idToken: value?.idToken,
      });

      toast.success(data.message);
    } catch (e) {
      console.log({ e });
    }

    cookie.remove("KJRIFR-U");
    await replace("/login");
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
