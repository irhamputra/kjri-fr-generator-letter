import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import { QueryClientProvider, QueryClient } from "react-query";
import { Toaster } from "react-hot-toast";

import MainLayout from "../components/layout/MainLayout";
import DashboardLayout from "../components/layout/Dashboard";
import parseCookies from "../utils/parseCookies";
import axios from "axios";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps, router, email, isAdmin }) {
  const isLoginPage = router.pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      {isLoginPage ? (
        <MainLayout>
          <Component {...pageProps} />
          <Toaster
            position="bottom-right"
            toastOptions={{ success: { duration: 2000 } }}
          />
        </MainLayout>
      ) : (
        <DashboardLayout isAdmin={isAdmin} email={email}>
          <Component {...pageProps} />
          <Toaster
            position="bottom-right"
            toastOptions={{ success: { duration: 2000 } }}
          />
        </DashboardLayout>
      )}
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  const cookie = parseCookies(ctx.req);

  // Allow this pages to be accessed without user cookie
  const whitelistedPage = ["/", "/register", "/_error"];

  if (!cookie["KJRIFR-U"] && !whitelistedPage.includes(ctx.pathname)) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {};
  } else if (cookie["KJRIFR-U"] && ctx.pathname === "/") {
    ctx.res.writeHead(302, { Location: "/dashboard" });
    ctx.res.end();
    return {};
  }

  if (!cookie["KJRIFR-U"]) return {};

  try {
    const json = JSON.parse(cookie["KJRIFR-U"]);
    const {
      data: { email },
    } = await axios.get("http://localhost:3000/api/v1/user", {
      headers: {
        authorization: `Bearer ${json.idToken}`,
      },
    });

    return { email, isAdmin: email.includes("admin") };
  } catch (e) {
    console.error(e);
    return {};
  }
};

export default MyApp;
