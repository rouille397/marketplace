import { MediaRenderer, useListing, useSDK } from "@thirdweb-dev/react";
import { utils } from "ethers";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { MarketplaceAddr } from "../../addresses";
import styles from "../../styles/Home.module.css";

const ListingPage: NextPage = () => {
  const [contract, setContract] = useState<any>(null);
  const [minNextBid, setMinNextBid] = useState<any>(null);
  const [winningBid, setWinningBid] = useState<any>(null);
  const [secondsTillEnd, setSecondsTillEnd] = useState<any>(null);
  const router = useRouter();
  const { address } = useAccount();
  const sdk = useSDK();

  const { listingId } = router.query as { listingId: string };

  useEffect(() => {
    if (!sdk) return;
    const getContract = async () => {
      const contract = await sdk.getContract(MarketplaceAddr, "marketplace");
      setContract(contract);
    };
    getContract();
  }, [sdk]);

  // Fetch the listing from the marketplace contract
  const { data: listing, isLoading: loadingListing } = useListing(
    contract,
    listingId
  );

  // Store the bid amount the user entered into the bidding textbox
  const [bidAmount, setBidAmount] = useState<string>("");

  //hook to call the makeOffer function in direct listing
  //   const { mutateAsync: makeOffer, isLoading: makeOfferLoading } =
  //     useMakeOffer(contract);

  //hook to call the makeBid function in auction listing

  //get all direct listing offers
  //   const { data: offers } = useOffers(contract, listingId);
  //   console.log(offers, "offerss");

  //what percentage higher the next bid must be than the current highest bid, or the starting price if there are no bids.
  //   const { data: bidBuffer, isLoading: bidBufferLoading } = useBidBuffer(
  //     contract,
  //     listingId
  //   );
  //   console.log(bidBuffer?.toString(), "bidBuffer");

  // minimum value a bid must be to be valid in an auction listing

  //get the auction winner

  console.log("contractt", contract);

  console.log(listing, "listingData");
  //   async function createBidOrOffer() {
  //     try {
  //       if (listing?.type == 0) {
  //         // await makeOffer({
  //         //   listingId: +listingId, // ID of the listing to make an offer on
  //         //   pricePerToken: +bidAmount, // Price per token to offer (in the listing's currency)
  //         //   quantity: 1, // Number of NFTs you want to buy (used for ERC1155 NFTs)
  //         // });
  //       } else {
  //         // If the listing type is an auction listing, then we can create a bid.
  //         await contract.auction.makeBid(listingId, bidAmount);
  //       }
  //       alert(
  //         `${
  //           listing?.type === ListingType.Auction ? "Bid" : "Offer"
  //         } created successfully!`
  //       );
  //     } catch (error) {
  //       console.error(error);
  //       alert(error);
  //     }
  //   }
  const createBidHandler = async () => {
    if (!contract || secondsTillEnd < 0) return;
    try {
      let tx: any = await contract.auction.makeBid.prepare(
        listingId,
        bidAmount
      );
      const gasLimit = await tx.estimateGasLimit(); // Estimate the gas limit
      tx.setGasLimit(Math.floor(gasLimit.toString() * 1.2));
      tx = await tx.execute(); // Execute the transaction
      alert("Bid created successfully!");
      minimumNextBid();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  async function buyNft() {
    try {
      let tx: any = await contract?.buyoutListing.prepare(listingId, 1);
      const gasLimit = await tx.estimateGasLimit(); // Estimate the gas limit
      tx.setGasLimit(Math.floor(gasLimit.toString() * 1.2));
      tx = await tx.execute(); // Execute the transaction
      alert("NFT bought successfully!");
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const cancelListingHandler = async () => {
    try {
      if (!contract) return;
      if (listing?.type === 0) {
        let tx: any = await contract.direct.cancelListing.prepare(listingId);
        const gasLimit = await tx.estimateGasLimit(); // Estimate the gas limit
        tx.setGasLimit(Math.floor(gasLimit.toString() * 1.2));
        tx = await tx.execute(); // Execute the transaction

        console.log(tx, "txResult");
        alert("Listing cancelled successfully!");
        router.push("/");
      } else {
        let tx: any = await contract.auction.cancelListing.prepare(listingId);
        const gasLimit = await tx.estimateGasLimit(); // Estimate the gas limit
        tx.setGasLimit(Math.floor(gasLimit.toString() * 1.2));
        tx = tx.execute(); // Execute the transaction
        alert("Listing cancelled successfully!");
      }
    } catch (e) {
      alert(e);
    }
  };
  console.log("minnextbidd", minNextBid);
  console.log("contractt", contract);

  function formatTime(seconds: number) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    let result = "";
    if (days > 0) {
      result += `${days}d `;
    }
    if (hours > 0) {
      result += `${hours}h `;
    }
    if (minutes > 0) {
      result += `${minutes}m `;
    }
    if (remainingSeconds > 0) {
      result += `${Math.floor(remainingSeconds)}s`;
    }
    return result.trim();
  }
  const calcTime = () => {
    if (listing?.type == 0) {
      setSecondsTillEnd(
        +listing?.secondsUntilEnd.toString() - new Date().getTime() / 1000
      );
    } else if (listing?.type == 1) {
      setSecondsTillEnd(
        +listing?.endTimeInEpochSeconds.toString() - new Date().getTime() / 1000
      );
    }
  };

  // if (listing?.secondsUntilEnd)
  //   secondsTillEnd = new Date(+listing?.secondsUntilEnd?.toString() * 500) - new Date().getTime() || 0;
  // else {
  //   //endTimeInEpochSeconds
  //   secondsTillEnd=
  //     new Date(+listing?.endTimeInEpochSeconds?.toString() * 500) - new Date().getTime() || 0;
  // }

  // console.log("secondstillend", dhm(secondsTillEnd));
  const minimumNextBid = async () => {
    const minimumNextBid = await contract.auction.getMinimumNextBid(listingId);
    console.log(minimumNextBid, "minimumNextBid");
    setMinNextBid(minimumNextBid.displayValue);
  };
  const getWinningBid = async () => {
    const winningBid = await contract.auction.getWinningBid(listingId);
    console.log(
      utils.formatEther(winningBid.pricePerToken.toString()),
      "winningBid"
    );
    setWinningBid(utils.formatEther(winningBid.pricePerToken.toString()));
  };

  //calcTime every 5 seconds

  useEffect(() => {
    if (secondsTillEnd > 0)
      setInterval(() => {
        calcTime();
      }, 5000);
  }, []);

  useEffect(() => {
    if (listing?.type === 1) {
      minimumNextBid();
      getWinningBid();
    }
  }, [listing]);

  if (loadingListing) {
    return <div className={styles.loadingOrError}>Loading...</div>;
  }

  if (!listing) {
    return <div className={styles.loadingOrError}>Listing not found</div>;
  }

  return (
    <div className={`${styles.container} mb-10`}>
      <h2 className="font-extrabold md:text-[64px] text-[42px] leading-[77px] tracking-wide md:mt-[190px] md:mb-[100px] mt-28 mb-12">
        Item details
      </h2>

      <div className={styles.listingContainer}>
        <div className={styles.leftListing}>
          <MediaRenderer
            src={listing.asset.image}
            className="w-[552px] h-auto max-w-full"
            width="552"
            height="552"
          />
        </div>

        <div className={styles.rightListing}>
          <div className="flex md:justify-between justify-center w-full">
            <h1 className="font-extrabold md:text-[48px] text-[32px] leading-[58px] tracking-wide mb-4">
              {listing.asset.name}
            </h1>
            {listing.type == 1 && (
              <>
                {secondsTillEnd > 0 ? (
                  <p className="pt-3 md:flex hidden">
                    Closing in {formatTime(secondsTillEnd)}
                  </p>
                ) : (
                  <p className="text-red-400 pt-3 md:flex hidden">
                    Listing Inactive
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex md:mb-10 mb-6">
            <p className="text-[#B2B2B2] font-medium text-xl leading-6 tracking-wide mr-5">
              Current Price:
            </p>
            <p className="font-extrabold text-[22px] leading-7 tracking-wide text-gradient">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>
          </div>
          <div
            className={`w-full relative max-w-[618px] h-auto md:min-h-[500px] min-h-[300px] bg-[#16192A] border-2 border-[#2E3150] rounded-xl md:pt-12 ${
              listing.type == 1 ? "pt-10" : "pt-4"
            }  md:pb-8 pb-4  md:px-10 px-5 md:mb-10 mb-5`}
          >
            {listing.type == 1 && (
              <>
                {secondsTillEnd > 0 ? (
                  <p className="pt-3 md:hidden absolute top-1 right-6">
                    Closing in {formatTime(secondsTillEnd)}
                  </p>
                ) : (
                  <p className="text-red-400 pt-3 md:hidden absolute top-1 right-6">
                    Listing Inactive
                  </p>
                )}
              </>
            )}
            <p className="text-[#878788] font-medium text-xl leading-9 tracking-wide capitalize md:mb-7 mb-3.5">
              {listing?.asset?.description}
            </p>
            <div className="flex items-center">
              <Image
                src="/images/dummy_person.png"
                alt="person-img"
                width={64}
                height={64}
                className="mr-4 md:w-16 md:h-16 h-12 w-12"
              />
              <div>
                <p className="font-medium md:text-xl text-base md:leading-6 leading-4 mb-2">
                  @
                  {listing.sellerAddress?.slice(0, 6) +
                    "..." +
                    listing.sellerAddress?.slice(36, 40)}
                </p>
                <p className="font-medium text-[15px] leading-[16px] text-[#878788]">
                  Owner
                </p>
              </div>
            </div>
            <div className="mt-7">
              <p>
                <b className="font-extrabold md:text-xl text-base leading-6 capitalize tracking-wide mr-2">
                  Token ID:
                </b>
                <span className="text-[#878788] font-normal md:text-xl text-base ">
                  {listing.asset.id || "N/A"}
                </span>
              </p>
            </div>
            <div className="mt-2">
              <p>
                <b className="font-extrabold md:text-xl text-base leading-6 capitalize tracking-wide mr-2">
                  Listing Type:
                </b>
                <span className="text-[#878788] font-normal md:text-xl text-base ">
                  {listing.type == 0 ? "Fixed Price" : "Auction"}
                </span>
              </p>
            </div>
            <hr className="md:my-6 my-3.5 border border-slate-700" />
            <div className="">
              {
                <div className="mt-2">
                  <p>
                    <b className="font-extrabold md:text-xl text-base leading-6 capitalize tracking-wide mr-2">
                      Listing Date:
                    </b>
                    <span className="text-[#878788] font-normal md:text-xl text-base ">
                      {listing.type == 0
                        ? new Date(
                            +listing?.startTimeInSeconds?.toString() * 1000
                          ).toLocaleString()
                        : new Date(
                            +listing?.startTimeInEpochSeconds?.toString() * 1000
                          ).toLocaleString()}
                    </span>
                  </p>
                </div>
              }

              {listing.type == 1 && (
                <div className="mt-2">
                  <p>
                    <b className="font-extrabold md:text-xl text-base leading-6 capitalize tracking-wide mr-2">
                      Closing Date:
                    </b>
                    <span className="text-[#878788] font-normal md:text-xl text-base ">
                      {listing.type == 1 &&
                        new Date(
                          +listing?.endTimeInEpochSeconds.toString() * 1000
                        ).toLocaleString()}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {
            <div className="flex gap-5 items-center w-full xl:pr-10 md:flex-row flex-col">
              {address == listing.sellerAddress ? (
                <button
                  style={{ borderStyle: "none" }}
                  className="uppercase font-bold text-base text-white gap-2 px-6 py-3 rounded-xl walletConnectButton  text-center !flex !items-center !justify-center flex-1 md:w-auto w-full xl:mr-5 max-w-[618px]"
                  onClick={cancelListingHandler}
                  disabled={minNextBid > 0}
                >
                  {winningBid > 0
                    ? `Winning bid ${winningBid}`
                    : "Cancel Listing"}
                </button>
              ) : (
                <button
                  style={{ borderStyle: "none" }}
                  className="uppercase font-bold text-base text-white gap-2 px-6 py-3 rounded-xl walletConnectButton  text-center !flex !items-center !justify-center flex-1 md:w-auto w-full  max-w-[618px]"
                  onClick={buyNft}
                  disabled={secondsTillEnd < 0}
                >
                  {secondsTillEnd < 0 ? (
                    " (Listing Inactive)"
                  ) : (
                    <span>
                      BUY IT NOW ({" "}
                      {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                      {listing.buyoutCurrencyValuePerToken.symbol})
                    </span>
                  )}
                </button>
              )}

              {address !== listing.sellerAddress && listing.type !== 0 && (
                <>
                  <p className="text-slate-500 md:flex hidden">|</p>
                  <p className="text-slate-500 md:hidden">OR</p>

                  <div
                    className="md:w-auto w-full"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <input
                      type="text"
                      name="bidAmount"
                      className={styles.textInput}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Amount"
                      style={{ marginTop: 0, marginLeft: 0, width: 128 }}
                      value={bidAmount}
                      disabled={secondsTillEnd < 0}
                    />

                    <button
                      className={`${styles.mainButton} ml-2`}
                      onClick={createBidHandler}
                      disabled={secondsTillEnd < 0}
                      style={{
                        borderStyle: "none",
                        width: "fit-content",
                      }}
                    >
                      Bid Now
                    </button>
                  </div>
                </>
              )}
            </div>
          }
          <div className="h-6 flex justify-end w-full">
            {console.log(
              "listing.type",
              listing.type,
              `bidAmount`,
              bidAmount,
              `minNextBid`,
              minNextBid
            )}
            {listing.type == 1 &&
              minNextBid &&
              +bidAmount < +minNextBid &&
              address !== listing.sellerAddress && (
                <p className="text-right w-full mt-2 pr-3">
                  Minimum next bid: {minNextBid}
                </p>
              )}
          </div>
          {/* Starting the Cancel operation from here */}
          {/* <div>
              <Web3Button
                contractAddress={marketplaceContractAddress}
                action={() =>
                  cancelListing({
                    id: listingId,
                    type: ListingType.Direct, // Direct (0) or Auction (1)
                  })
                }
              >
                Cancel Listing
              </Web3Button>
            </div> */}
          {/* Ending the cancle operation here */}
        </div>
      </div>
      {/* {listing.type == 0 && (
        <div className="max-w-[90vw] w-full mt-36">
          <h2 className="font-bold leading-[68px] text-[56px] tracking-wide text-center mb-12">
            Offers
          </h2>
          <Table assetDetails={listing} />
        </div>
      )} */}
    </div>
  );
};

export default ListingPage;
