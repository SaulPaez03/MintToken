import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MyToken - Mint</title>
      </Head>

      <ThemeProvider theme={createTheme()}>
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-center"
          autoClose={false}
          rtl={false}
          closeOnClick={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="light"
        ></ToastContainer>
      </ThemeProvider>
    </>
  );
}
