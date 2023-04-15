import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import {
  MediaRenderer,
  useActiveListings,
  useActiveChain,
  useSwitchChain,
  useMetamask,
  useContract,
  ConnectWallet,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { marketplaceContractAddress } from "../addresses";

const Home: NextPage = () => {
  const router = useRouter();
  const connectWithMetamask = useMetamask();
  const { contract: marketplace } = useContract(
    marketplaceContractAddress,
    "marketplace"
  );
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(marketplace);

  const chain = useActiveChain();

  console.log("chain", chain?.name);
  return (
    <>
      {/* Content */}
      <div className={styles.container}>
        {/* Top Section */}
        <h1 className={styles.h1}>NITFEE Conflux Espace</h1>
        <p className={styles.explain}>
         Buy and sell your favorite collection NFT with the low fees transaction,and earn CFX. {" "}
          <b>
            {" "}
            <a
              href=""
              target=""
              rel="noopener noreferrer"
              className={styles.purple}
            >
           
            </a>
          </b>{" "}
          
        </p>

        <hr className={styles.divider} />

        <div style={{ marginTop: 32, marginBottom: 32 }}>
          {chain?.name === undefined ? (
            <a
              className={styles.mainButton}
              onClick={() => connectWithMetamask()}
            >
              Connect Wallet
            </a>
          ) : (
            <Link
              href="/create"
              className={styles.mainButton}
              style={{ textDecoration: "none" }}
            >
              Create A Listing
            </Link>
          )}
          {/* <Link href="/cancel" className={`${styles.mainButton}`} style={{ textDecoration: "none" }}>
            Cancel A Listing
          </Link> */}
        </div>

        <div className="main">
          {
            // If the listings are loading, show a loading message
            chain?.name && loadingListings ? (
              <div>Loading listings...</div>
            ) : (
              // Otherwise, show the listings
              <div className={styles.listingGrid}>
                {listings?.map((listing) => (
                  <div
                    key={listing.id}
                    className={styles.listingShortView}
                    onClick={() => router.push(`/listing/${listing.id}`)}
                  >
                    <MediaRenderer
                      src={listing.asset.image}
                      style={{
                        borderRadius: 16,
                        // Fit the image to the container
                        width: "100%",
                        height: "100%",
                      }}
                    />
                    <h2 className={styles.nameContainer}>
                      <Link
                        href={`/listing/${listing.id}`}
                        className={styles.name}
                      >
                        {listing.asset.name}
                      </Link>
                    </h2>

                    <p>
                      <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </>
  );
};

export default Home;
