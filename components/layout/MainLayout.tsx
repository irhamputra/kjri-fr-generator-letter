import * as React from "react";
import { useRouter } from "next/router";
import DashboardLayout from "./Dashboard";

const MainLayout: React.FC<{ email: string; isAdmin: boolean }> = ({
  children,
  isAdmin,
  email,
}) => {
  const { pathname } = useRouter();

  const isLoginPage = pathname === "/";

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        {isLoginPage ? (
          children
        ) : (
          <DashboardLayout email={email} isAdmin={isAdmin}>
            {children}
          </DashboardLayout>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
