import * as React from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import axios from "axios";
import { toast } from "react-hot-toast";

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
    <nav className="bg-light d-flex justify-content-end p-3">
      <div className="d-flex align-items-center">
        <p className="ms-auto my-0">
          Hello, <strong>{email}</strong>
        </p>
        <button
          className="btn btn-link fw-bold text-dark"
          onClick={handleLogout}
        >
          Keluar
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
