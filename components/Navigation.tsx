import * as React from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ChevronDown, Gear, House, List } from "react-bootstrap-icons";
import Popup from "./Popup";
import Link from "next/link";
import useBreakpoint from "../hooks/useBreakpoints";
import { useAuthContext } from "../context/AuthContext";

const Navigation: React.FC = () => {
  const { replace, reload, push } = useRouter();
  const [showMenu, setShowMenu] = React.useState(false);
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const { data } = useAuthContext();

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

  const { is } = useBreakpoint();

  return (
    <>
      <nav className="bg-light d-flex justify-content-between p-3">
        <div>
          {is(["xs", "sm"]) && (
            <button onClick={() => setIsOpen((open) => !open)} className="btn">
              <List style={{ width: 32, height: 32 }} />
            </button>
          )}
        </div>
        <div className="d-flex align-items-center">
          <div
            className="d-flex p-2 align-items-center px-3"
            style={{ borderRadius: 20, cursor: "pointer" }}
            onClick={() => setShowMenu(true)}
            ref={setReferenceElement}
          >
            <p className="ms-auto my-0 mx-2">
              Hello, <strong>{data?.displayName}</strong>
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
                <button className="dropdown-item" type="button" onClick={() => push("/profile/me")}>
                  Edit Profile
                </button>
                <li className="dropdown-divider"></li>
                <button className="dropdown-item" type="button" onClick={handleLogout}>
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
      {is(["xs", "sm"]) && isOpen && (
        <div className="mb-5">
          <div className="dropdown-menu-left" style={{ borderBottom: "1px solid #e2e2e2" }}>
            <Link href="/dashboard">
              <a className="d-flex align-items-center p-3">
                <House size={25} />
                <p className="my-0 mx-2 ">Dashboard</p>
              </a>
            </Link>
            <Link href="/pengaturan">
              <a className="d-flex align-items-center p-3">
                <Gear size={25} />
                <p className="my-0 mx-2">Pengaturan</p>
              </a>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
