import * as React from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navigation: React.FC = () => {
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
    await replace("/");
  };

  return (
    <nav className="bg-dark d-flex justify-content-between p-3 align-items-center">
      <h4 className="text-white my-0">Sistem Aplikasi KJRI Frankfurt</h4>
      <div className="d-flex align-items-center">
        <p className="ms-auto my-0 text-white">Hello, Admin</p>
        <button className="btn btn-link text-white" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
