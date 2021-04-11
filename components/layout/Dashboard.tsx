import * as React from "react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";

const DashboardLayout: React.FC<{
  displayName: string;
  isAdmin: boolean;
}> = ({ children, isAdmin, displayName }) => {
  return (
    <>
      <Sidebar isAdmin={isAdmin} />
      <div className="col p-0 mb-5">
        <Navigation displayName={displayName} />
        <div className="container-fluid">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
