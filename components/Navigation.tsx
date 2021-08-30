import * as React from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Bell, ChevronDown, Gear, House, List } from "react-bootstrap-icons";
import Popup from "./Popup";
import Link from "next/link";
import useBreakpoint from "../hooks/useBreakpoints";
import { LegacyRef } from "react";
import useQueryAuth from "../hooks/query/useQueryAuth";

const Navigation = (): JSX.Element => {
  const { replace, reload, push } = useRouter();
  const [showMenu, setShowMenu] = React.useState(false);
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: query = {} } = useQueryAuth();

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

  const notification = React.useMemo(() => {
    return Object.entries(query).reduce((acc, [key, value]) => {
      return key === "isAdmin" || value ? acc : acc + 1;
    }, 0);
  }, [query]);

  return (
    <>
      <nav className="bg-light d-flex fixed-top justify-content-between p-3">
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
            ref={setReferenceElement as LegacyRef<HTMLDivElement> | undefined}
          >
            {notification > 0 && (
              <section className="mx-3">
                <span onClick={() => setShowMenu(true)} style={{ cursor: "pointer" }} className="position-relative">
                  <Bell size={23} />
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                    <span className="visually-hidden">New alerts</span>
                  </span>
                </span>
              </section>
            )}

            <div
              onClick={() => setShowMenu(true)}
              style={{ borderRadius: 20, cursor: "pointer" }}
              className="d-flex align-items-center"
            >
              <p className="ms-auto my-0 mx-3">
                Hello, <strong>{query?.displayName || "Pegawai Baru"}</strong>
              </p>
              <ChevronDown />
            </div>
          </div>
          <Popup
            open={showMenu}
            anchorRef={referenceElement}
            onClickOutside={() => setShowMenu(false)}
            placement="bottom-end"
          >
            <div
              className="p-2"
              style={{
                background: "white",
              }}
            >
              <div className="dropdown-menu-left">
                <button className="dropdown-item position-relative" type="button" onClick={() => push("/profile/me")}>
                  Edit Profile
                  {notification > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  )}
                </button>

                <li className="dropdown-divider" />
                <button className="dropdown-item" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </Popup>
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
