import * as React from "react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";

const DashboardLayout: React.FC<{ email?: string; isAdmin: boolean }> = ({
  children,
  email,
  isAdmin,
}) => {
  return (
    <>
      <Navigation email={email} />
      <div className="row">
        <Sidebar isAdmin={isAdmin} />
        <div className="col-9">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
