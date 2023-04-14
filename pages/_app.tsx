import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ConfluxEspace } from "@thirdweb-dev/chains";
import "../styles/globals.css";
import Header from "../components/Header";
import Head from "next/head";
import Layout from "../components/Layout";

// This is the chainId your dApp will work on.
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={ConfluxEspace}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebProvider>
  );
}

export default MyApp;
// {
//   /* <Head>
//         <title>Nitfee Marketplace</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <meta
//           name="description"
//           content="List Your NFTs For Sale, Accept Bids, and Buy NFTs"
//         />
//         <meta
//           name="keywords"
//           content="Thirdweb, Marketplace, NFT Marketplace Tutorial, NFT Auction Tutorial, How To Make OpenSea"
//         />
//       </Head> */
// }
