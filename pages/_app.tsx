import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "react-query";
import { Toaster } from "react-hot-toast";

import MainLayout from "../components/layout/MainLayout";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          toastOptions={{ success: { duration: 2000 } }}
        />
      </MainLayout>
    </QueryClientProvider>
  );
}

export default MyApp;
