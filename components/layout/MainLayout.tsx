import * as React from "react";
import { useRouter } from "next/router";
import DashboardLayout from "./Dashboard";

const MainLayout: React.FC<{
  displayName: string;
  isAdmin: boolean;
}> = ({ children, isAdmin, displayName }) => {
  const { pathname } = useRouter();

  const isAuthPage = ["/", "/forget-password", "/_error"].includes(pathname);

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        {isAuthPage ? (
          children
        ) : (
          <DashboardLayout displayName={displayName} isAdmin={isAdmin}>
            {children}
          </DashboardLayout>
        )}
      </div>

      {!isAuthPage && (
        <footer className="footer text-center mt-auto py-1 bg-light fixed-bottom">
          <div className="container-fluid d-flex justify-content-between">
            <span className="text-muted small">
              Built with ❤️ &nbsp; for KJRI Frankfurt 🇮🇩
            </span>
            <span className="text-muted small">
              <a href="mailto:irhamputraprasetyo@gmail.com">Contact me</a>
            </span>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
