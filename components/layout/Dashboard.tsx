import * as React from "react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <>
      <Navigation />
      <div className="row">
        <Sidebar />
        <div className="col-9">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
