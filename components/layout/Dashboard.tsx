import * as React from "react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";

const DashboardLayout: React.FC<{ email: string; isAdmin: boolean }> = ({
  children,
  isAdmin,
  email,
}) => {
  return (
    <>
      <Navigation email={email} />
      <div className="row mt-5">
        <Sidebar isAdmin={isAdmin} />
        <div className="col mt-5">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
