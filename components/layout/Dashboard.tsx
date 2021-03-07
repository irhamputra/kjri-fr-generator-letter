import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import axios from "axios";
import cookie from "js-cookie";
import { toast } from "react-hot-toast";

const cookies = cookie.get("KJRIFR-U");

const DashboardLayout: React.FC = ({ children }) => {
  const { replace } = useRouter();

  const { mutateAsync } = useMutation(
    ["logoutUser"],
    async (idToken: string) => {
      try {
        const { data } = await axios.post("/api/v1/logout", {
          idToken,
        });

        return data;
      } catch (e) {
        throw new Error(e);
      }
    },
    {
      onSuccess: (data) => {
        cookie.remove("KJRIFR-U");
        toast.success(data.message);
      },
    }
  );

  const handleLogout = async () => {
    try {
      if (cookies) {
        const value = JSON.parse(cookies ?? "");
        await mutateAsync(value.idToken);
      }
    } catch (e) {
      throw new Error(e);
    }

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
