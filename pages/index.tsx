import React, { useState, useEffect } from "react";
import { useSDK } from "@thirdweb-dev/react";
import Headers from "../components/Header";
import NftCard from "../components/NftCard";
import { MarketplaceAddr } from "../addresses";
import Button from "../components/Button";
import { useRouter } from "next/router";
import Head from "next/head";
import NftCarousel from "../components/NftCarousel";
import Loading from "../components/Loading";
import Image from "next/image";
import starIcon from "../public/images/star.svg";
import circleIcon from "../public/images/circle.svg";
import NftStep from "../components/NftStep";
import { CATEGORIES, NFT_STEPS } from "../constants";
import { useSigner } from "wagmi";

export default function Home() {
  const [recentlyAdded, setRecentlyAdded] = useState<any>([]);
  const [recentlySold, setRecentlySold] = useState<any>([]);
  const [allListingData, setAllListingData] = useState<any>([]);
  const [listingPagination, setListingPagination] = useState<any>({
    count: 10, // Number of auctions to fetch
    start: 0, // Start from this index (pagination)
  });
  const [contract, setContract] = useState<any>(null);
  const [currentBlockNum, setCurrentBlockNum] = useState<any>(null);

  const [listingLoading, setListingLoading] = useState(false);
  const [recentlyAddedLoading, setRecentlyAddedLoading] = useState(false);
  const [recentlySoldLoading, setRecentlySoldLoading] = useState(false);

  const { data: signer } = useSigner();
  const provider = signer?.provider;

  const router = useRouter();

  const sdk = useSDK();

  useEffect(() => {
    if (!sdk) return;

    (async () => {
      try {
        const contract = await sdk.getContract(
          MarketplaceAddr,
          "marketplace" // Provide the "marketplace" contract type
        );

        const currentBlock = await provider?.getBlockNumber();
        setCurrentBlockNum(currentBlock);
        setContract(contract);
      } catch (e) {
        console.log("error", e);
      }
    })();
  }, [sdk]);

  useEffect(() => {
    if (!contract) return;

    (async () => {
      try {
        setListingLoading(true);
        const listings = await contract.getActiveListings({
          start: listingPagination.start,
          count: listingPagination.count,
        });
        setAllListingData(listings);
        setListingLoading(false);
        console.log("listingsss", listings);
      } catch (e) {
        console.log("listingError", e);
        setListingLoading(false);
      }
    })();
  }, [contract, listingPagination]);

  //recently listed
  useEffect(() => {
    if (!contract || !currentBlockNum || recentlyAdded.length > 0) return;
    (async () => {
      setListingLoading(true);

      let currentBlock = currentBlockNum;
      //get 5% of the block number
      let from = currentBlock - Math.floor(currentBlock * 0.03);
      let tryCount = 0;
      let newlyAddedNFTs: any = [];
      console.log("check1");
      while (tryCount < 5 && newlyAddedNFTs.length < 5) {
        try {
          let newlyAdded = await contract?.events.getEvents("ListingAdded", {
            // fromBlock: from,
            // toBlock: currentBlock,
            order: "desc",
          });
          console.log("newlyAddedids", newlyAdded);
          newlyAddedNFTs = [...newlyAddedNFTs, ...newlyAdded];
          if (newlyAddedNFTs.length > 5) break;
          currentBlock = from;
          from = from - Math.floor(currentBlock * 0.03);
          tryCount++;
        } catch (e) {
          console.log("errorrrrr", e);
          continue;
        }
      }
      let listingIds = newlyAddedNFTs.map((item: any) =>
        item.data.listingId.toString()
      );

      let listingDataPromises: any = [];
      listingIds.forEach((id: any) => {
        listingDataPromises.push(contract?.getListing(id));
      });
      let results = await Promise.all(
        listingDataPromises.map((p: any) => p.catch((e: any) => e))
      );
      const validResults = results.filter(
        (result: any) => !(result instanceof Error)
      );

      console.log("newlyAddedNFTs", validResults);
      setRecentlyAdded(validResults);
      setListingLoading(false);
    })();
  }, [contract, currentBlockNum]);

  // //this useEffect will find recently sold NFTS
  useEffect(() => {
    (async () => {
      if (!contract || recentlySold.length > 0 || !currentBlockNum) return;
      setRecentlySoldLoading(true);
      let currentBlock = currentBlockNum;
      //get 5% of the block number
      let from = currentBlock - Math.floor(currentBlock * 0.03);
      let tryCount = 0;
      let recentlySoldNfts: any = [];

      while (tryCount < 5 && recentlySoldNfts.length < 5) {
        console.log("tryCount", tryCount);
        try {
          let recentlySoldd = await contract?.events.getEvents("NewSale", {
            fromBlock: 0,
            toBlock: currentBlock,
            order: "desc",
          });
          console.log("recentlySoldd", recentlySoldd);
          recentlySoldNfts = [...recentlySoldNfts, ...recentlySoldd];
          if (recentlySoldNfts.length > 5) break;
          currentBlock = from;
          from = from - Math.floor(currentBlock * 0.03);

          tryCount++;
        } catch (e) {
          continue;
        }
      }

      console.log("recentlySoldNftEvents", recentlySoldNfts);
      let listingIds = recentlySoldNfts.map((item: any) =>
        item.data.listingId.toString()
      );

      let listingDataPromises: any = [];
      listingIds.forEach((id: any) => {
        listingDataPromises.push(contract?.getListing(id));
      });
      let results = await Promise.all(
        listingDataPromises.map((p: any) => p.catch((e: any) => e))
      );
      let validResults = results.filter(
        (result: any) => !(result instanceof Error)
      );
      validResults = validResults.map((item: any) => ({ ...item, sold: true }));
      setRecentlySold(validResults);
      setRecentlySoldLoading(false);
      console.log("recentlySoldNfts", validResults);
    })();
  }, [contract, currentBlockNum]);

  console.log("recentlyAdded", recentlyAdded);

  return (
    <>
      <Head>
        <title>Nitfee Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="List Your NFTs For Sale, Accept Bids, and Buy NFTs"
        />
        <meta
          name="keywords"
          content="Thirdweb, Marketplace, NFT Marketplace Tutorial, NFT Auction Tutorial, How To Make OpenSea"
        />
      </Head>
      <div className="">
        <Headers />
        {/* Nft Steps */}
        <div className="px-4 my-[60px] lg:my-[120px] lg:px-[75px]">
          <div className="flex flex-col justify-center items-center w-full gap-3">
            <p className="text-gradient-secondary text-xl font-normal uppercase flex gap-2">
              TO BE CREATOR <Image src={starIcon} alt="marketplan" />
            </p>
            <h5 className="text-[28px] text-white lg:text-[32px] font-bold flex lg:gap-3">
              Create and Sell Your NFTs{" "}
              <Image
                src={circleIcon}
                alt="Create and Sell Your NFTs"
                className="relative top-[-16px] lg:top-0"
              />
            </h5>
          </div>
          <div className="block lg:flex justify-center items-end gap-10 mt-12 lg:h-[438px]">
            {NFT_STEPS?.map((step) => (
              <NftStep
                key={step.step}
                title={step.title}
                description={step.description}
                step={step.step}
              />
            ))}
          </div>
        </div>
        {/* Explore Marketplace */}
        <div className="px-6 my-[60px] lg:my-[120px] md:px-[75px] min-h-[600px]">
          <h1 className="text-[32px] lg:text-[59px] font-semibold text-white text-center mb-12">
            Explore Marketplace
          </h1>
          <div className="flex justify-start lg:justify-center items-center gap-5 mb-12 overflow-x-scroll ">
            {CATEGORIES?.map((category, i) => (
              <Button key={category} type="rounded" className="">
                {category}
              </Button>
            ))}
          </div>

          {listingLoading ? (
            <Loading isLoading={listingLoading} />
          ) : (
            <div className="flex w-full overflow-x-scroll md:overflow-auto md:grid grid-cols-3 min-[1390px]:grid-cols-4 gap-6 ">
              {allListingData &&
                allListingData?.map((item: any) => (
                  <NftCard
                    key={item.id}
                    name={item.asset.name}
                    user={"@user"}
                    symbol={item.buyoutCurrencyValuePerToken.symbol}
                    price={item.buyoutCurrencyValuePerToken.displayValue}
                    image={item.asset.image}
                    onClick={() => router.push(`/listing/${item.id}`)}
                  />
                ))}
            </div>
          )}
          {/* {!directLoading && (
            <div className="text-center mt-12">
              <Button type="rounded">View More</Button>
            </div>
          )} */}
        </div>
        {/* Newly listed */}

        <div className="px-4 my-[60px] lg:my-[120px] lg:px-[75px] min-h-[500px]">
          <h1 className="text-[32px] lg:text-[59px] font-semibold text-white text-center mb-12">
            Newly Listed
          </h1>

          {recentlyAddedLoading ? (
            <Loading isLoading={recentlyAddedLoading} />
          ) : (
            <NftCarousel listing={recentlyAdded} />
          )}
        </div>

        {/* Recently sold */}

        <div className="px-4 my-[60px] lg:my-[120px] lg:px-[75px] min-h-[500px]">
          <h1 className="text-[32px] lg:text-[59px] font-semibold text-white text-center mb-12">
            Recently Sold{" "}
          </h1>

          {recentlySoldLoading ? (
            <Loading isLoading={recentlySoldLoading} />
          ) : (
            <NftCarousel listing={recentlySold} />
          )}
        </div>
        {/* Contact us */}
        {/* <div className="my-[120px] px-[75px]">
          <Contact />
        </div> */}
      </div>
    </>
  );
}
