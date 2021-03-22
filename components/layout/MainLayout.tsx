import * as React from "react";
import { useRouter } from "next/router";
import DashboardLayout from "./Dashboard";

const MainLayout: React.FC<{ email: string; isAdmin: boolean }> = ({
  children,
  isAdmin,
  email,
}) => {
  const { pathname } = useRouter();

  const isAuthPage = ["/", "/forget-password", "/_error"].includes(pathname);

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        {isAuthPage ? (
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
