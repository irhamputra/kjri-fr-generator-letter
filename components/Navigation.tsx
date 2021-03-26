import * as React from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

const Navigation: React.FC<{ email: string }> = ({ email }) => {
  const { replace, reload } = useRouter();

  const handleLogout = async () => {
    try {
      const idToken = cookie.get("KJRIFR-U");

      const { data } = await axios.post("/api/v1/logout", { idToken });

      toast.success(data.message);
    } catch (e) {
      reload();
    }

    cookie.remove("KJRIFR-U");
    cookie.remove("rtfa");
    reload();
    await replace("/");
  };

  return (
    <nav className="bg-dark d-flex justify-content-between fixed-top p-3 align-items-center">
      <Link href="/dashboard">
        <a>
          <h4 className="text-white my-0">Sistem Aplikasi KJRI Frankfurt</h4>
        </a>
      </Link>
      <div className="d-flex align-items-center">
        <p className="ms-auto my-0 text-white">Hello, {email}</p>
        <button className="btn btn-link text-white" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
