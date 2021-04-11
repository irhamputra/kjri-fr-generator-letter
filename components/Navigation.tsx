import * as React from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ChevronDown } from "react-bootstrap-icons";
import Popup from "./Popup";
import Link from "next/link";

const Navigation: React.FC<{ displayName: string }> = ({ displayName }) => {
  const { replace, reload, push } = useRouter();
  const [showMenu, setShowMenu] = React.useState(false);
  const [referenceElement, setReferenceElement] = React.useState(null);

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
        <div
          className="d-flex p-2 align-items-center px-3"
          style={{ borderRadius: 20, cursor: "pointer" }}
          onClick={() => setShowMenu(true)}
          ref={setReferenceElement}
        >
          <p className="ms-auto my-0 mx-2">
            Hello, <strong>{displayName}</strong>
          </p>
          <ChevronDown />
        </div>
        <Popup
          open={showMenu}
          anchorRef={referenceElement}
          onClickOutside={() => setShowMenu(false)}
          placement="bottom"
        >
          <div
            className="p-2"
            style={{
              background: "white",
            }}
          >
            <div className="dropdown-menu-left">
              <button
                className="dropdown-item"
                type="button"
                onClick={() => push("/profile/me")}
              >
                Edit Profile
              </button>
              <li className="dropdown-divider"></li>
              <button
                className="dropdown-item"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </Popup>

        {/* <button
          className="btn btn-link fw-bold text-dark"
          onClick={handleLogout}
        >
          Keluar
        </button> */}
      </div>
    </nav>
  );
};

export default Navigation;
