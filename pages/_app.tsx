import type { AppProps } from "next/app";
import { ThirdwebSDKProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Head from "next/head";
import { Roboto } from "next/font/google";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, useSigner, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import "@rainbow-me/rainbowkit/styles.css";
import { Conflux } from "../helpers/cfx";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { Conflux_Testnet } from "../helpers/cfx-testnet";
import { goerli } from "wagmi/chains";
import Layout from "@/components/Layout";

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
function MyApp({ Component, pageProps }: AppProps) {
  const { provider, chains } = configureChains(
    [Conflux, Conflux_Testnet, goerli],
    [
      jsonRpcProvider({
        rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
      }),
    ]
  );

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet({ chains })],
    },
  ]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  function ThirdwebProvider({
    wagmiClient,
    children,
  }: {
    wagmiClient: any;
    children: React.ReactNode;
  }) {
    const { data: signer } = useSigner();

    return (
      <ThirdwebSDKProvider
        activeChain={71}
        signer={signer as any}
        queryClient={wagmiClient.queryClient as any}
      >
        {children}
      </ThirdwebSDKProvider>
    );
  }

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <ThirdwebProvider wagmiClient={wagmiClient}>
          <Head>
            <title>Nitfee Marketplace</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta
              name="description"
              content="List Your NFTs For Sale, Accept Bids, and Buy NFTs"
            />
            <meta
              name="keywords"
              content="Thirdweb, Marketplace, NFT Marketplace Tutorial, NFT Auction Tutorial, How To Make OpenSea"
            />
          </Head>
          <main className={roboto.className}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </main>
        </ThirdwebProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
