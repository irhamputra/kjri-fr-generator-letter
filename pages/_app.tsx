import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import { QueryClientProvider, QueryClient } from "react-query";
import { Toaster } from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import parseCookies from "../utils/parseCookies";
import axios from "axios";

import { DefaultSeo } from "next-seo";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps, email, isAdmin }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DefaultSeo
        title="Sistem Aplikasi KJRI Frankfurt"
        description="Sistem Aplikasi KJRI Frankfurt"
      />
      <MainLayout email={email} isAdmin={isAdmin}>
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          toastOptions={{ success: { duration: 2000 } }}
        />
      </MainLayout>
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  const cookie = parseCookies(ctx.req);

  const whitelistedPage = ["/", "/forget-password", "/_error"];

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

  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://sistem-nomor-surat-kjri-frankfurt.vercel.app";

  try {
    const idToken = cookie["KJRIFR-U"];

    const {
      data: { email },
    } = await axios.get(`${BASE_URL}/api/v1/user`, {
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    });

    return { email, isAdmin: email.includes("admin") };
  } catch (e) {
    throw new Error(e.message);
  }
};

export default MyApp;
