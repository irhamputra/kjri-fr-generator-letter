import * as React from "react";
import useBreakpoint from "../../hooks/useBreakpoints";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import { useAuthContext } from "../../context/AuthContext";

const DashboardLayout: React.FC = ({ children }) => {
  const { is } = useBreakpoint();
  const {
    data: { displayName },
  } = useAuthContext();

  return (
    <>
      {!is(["sm", "xs"]) && <Sidebar />}
      <div className="col p-0 mb-5">
        <Navigation displayName={displayName} />
        <div className="container-fluid">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
