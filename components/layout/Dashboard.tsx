import * as React from "react";
import useBreakpoint from "../../hooks/useBreakpoints";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";

const DashboardLayout: React.FC = ({ children }) => {
  const { is } = useBreakpoint();

  return (
    <>
      {!is(["sm", "xs"]) && <Sidebar />}
      <div className="col p-0 mb-5" style={{ marginLeft: "16.6666666667%" }}>
        <Navigation />
        <div className="container-fluid">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
