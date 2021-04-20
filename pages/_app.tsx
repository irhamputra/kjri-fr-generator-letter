import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { dehydrate, Hydrate } from "react-query/hydration";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { DefaultSeo } from "next-seo";
import MainLayout from "../components/layout/MainLayout";
import parseCookies from "../utils/parseCookies";
import apiInstance from "../utils/firebase/apiInstance";

function MyApp({ Component, pageProps, dehydrateState }) {
  const queryClientRef = React.useRef<null | QueryClient>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps?.dehydrateState ?? dehydrateState}>
        <DefaultSeo title="Sistem Aplikasi KJRI Frankfurt" description="Sistem Aplikasi KJRI Frankfurt" />
        <MainLayout>
          <Component {...pageProps} />
          <Toaster position="bottom-right" toastOptions={{ success: { duration: 2000 } }} />
        </MainLayout>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  const cookie = parseCookies(ctx.req);
  const queryClient = new QueryClient();

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

  try {
    const idToken = cookie["KJRIFR-U"];

    await queryClient.prefetchQuery("auth", async () => {
      const { data } = await apiInstance.get("/api/v1/user", {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      });

      return data;
    });

    return {
      dehydrateState: dehydrate(queryClient),
    };
  } catch (e) {
    return {};
  }
};

export default MyApp;
