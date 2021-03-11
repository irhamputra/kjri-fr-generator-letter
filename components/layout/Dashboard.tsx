import * as React from "react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <>
      <Navigation />
      <Sidebar />
      <div className="col-9">{children}</div>
    </>
  );
};

export default DashboardLayout;
