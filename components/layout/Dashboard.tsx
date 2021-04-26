import { useRouter } from "next/router";
import * as React from "react";
import Loader from "react-loader-spinner";
import useBreakpoint from "../../hooks/useBreakpoints";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";
import styles from "../../styles/Home.module.css";

const DashboardLayout: React.FC = ({ children }) => {
  const { is } = useBreakpoint();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleChangeStart = () => {
    setLoading(true);
  };
  const handleChangeDone = () => {
    setLoading(false);
  };

  React.useEffect(() => {
    router.events.on("routeChangeStart", handleChangeStart);
    router.events.on("routeChangeComplete", handleChangeDone);
    router.events.on("routeChangeError", handleChangeDone);
    return function cleanup() {
      router.events.off("routeChangeStart", handleChangeStart);
      router.events.off("routeChangeComplete", handleChangeDone);
      router.events.off("routeChangeError", handleChangeDone);
    };
  });

  return (
    <>
      {!is(["sm", "xs"]) && <Sidebar />}
      <div className="col p-0 mb-5" style={{ marginLeft: "16.6666666667%" }}>
        <Navigation />
        <div className="container-fluid position-relative" style={{ minHeight: "calc(100vh - 120px)" }}>
          <div
            className={styles.backdrop}
            style={{
              opacity: loading ? 1 : 0,
              visibility: loading ? "visible" : "hidden",
              transition: "all 0.4s",
            }}
          >
            <Loader type="TailSpin" color="#00BFFF" height={80} width={80} />
          </div>
          <div
            style={{
              display: !loading ? "inherit" : "none",
              opacity: !loading ? 1 : 0,
              visibility: !loading ? "visible" : "hidden",
              transition: "all 0.4s",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
