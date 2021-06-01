import * as React from "react";
import { useRouter } from "next/router";
import DashboardLayout from "./Dashboard";

const MainLayout: React.FC = ({ children }) => {
  const { pathname } = useRouter();

  const isAuthPage = ["/", "/forget-password", "/_error", "/register", "/create-new-account"].includes(pathname);

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">{isAuthPage ? children : <DashboardLayout children={children} />}</div>

      {!isAuthPage && (
        <footer className="footer text-center mt-auto py-1 bg-light fixed-bottom" style={{ zIndex: 9999 }}>
          <div className="container-fluid d-flex justify-content-between">
            <span className="text-muted small">Built with ❤️ &nbsp; for KJRI Frankfurt 🇮🇩</span>
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
