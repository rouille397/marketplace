import { useAddress, useSDK } from "@thirdweb-dev/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import NftCard from "../../components/NftCard";
import { db } from "../../helpers/firebase-config";
import creatorImage from "../../public/images/creator-image.png";
import { MarketplaceAddr } from "../../addresses";

const Collection = () => {
  const [collectionData, setCollectionData] = useState([]);
  const [collectionDataLoading, setCollectionDataLoading] = useState(false);
  const [nftsList, setNftsList] = useState([]);
  const [contract, setContract] = useState(null);
  const address = useAddress();
  const router = useRouter();
  const { collectionId } = router.query;
  console.log("collectionId", collectionData);
  const sdk = useSDK();
  useEffect(() => {
    if (!sdk) return;
    const getContract = async () => {
      const contract = await sdk.getContract(MarketplaceAddr, "marketplace");
      setContract(contract);
    };
    getContract();
  }, [sdk]);

  useEffect(() => {
    if (!address) return;
    (async () => {
      setCollectionDataLoading(true);
      const collectionRef = collection(db, "collections");
      const q = query(
        collectionRef,
        where("collectionAddress", "==", collectionId)
      );
      const collectionSnapshot = await getDocs(q);
      const collectionData = collectionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCollectionDataLoading(false);
      setCollectionData(collectionData);
    })();
  }, [address, contract]);

  useEffect(() => {
    if (!contract || !collectionData[0]) return;
    (async () => {
      const listings = await contract.getActiveListings({
        tokenContract: collectionData[0]?.collectionAddress, // Only return listings that are selling tokens from this contract
      });
      console.log("listings", listings);
      setNftsList(listings);
    })();
  }, [contract, collectionData[0]]);

  // get collection data from firbase using address

  return (
    <>
      <Head>
        <title>{collectionData[0]?.name}</title>
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
      <div className="px-4 py-6 lg:px-[75px] lg:py-[120px]">
        <div className="w-full h-[300px] bg-[#16192A] border-[2px] border-[#2E3150] rounded-[10px] flex justify-center items-end">
          <div className="relative top-[100px] text-center">
            <Image
              src={collectionData[0]?.image || creatorImage}
              alt="Nitee marketplace"
              width={240}
              height={240}
              className=""
            />
            <h1 className="text-textLight font-extrabold text-[22px]">
              {collectionData[0] &&
                collectionData[0]?.collectionAddress?.slice(0, 5) +
                  "..." +
                  collectionData[0]?.collectionAddress?.slice(-4)}
            </h1>
            <p className="text-[#989898] text-lg font-semibold">@laural123</p>
          </div>
        </div>
        <div className="mt-[120px] md:mt-[250px] grid md:grid-cols-3 min-[1380px]:grid-cols-4 gap-4 ">
          {nftsList.map((item) => (
            <div
              className="cursor-pointer"
              onClick={() =>
                router.push({
                  pathname: `/listing/${item.id}`,
                })
              }
            >
              <NftCard
                key={item.id}
                name={item.asset.name}
                price={item.buyoutCurrencyValuePerToken?.displayValue}
                symbol={"CFX"}
                user={
                  item.sellerAddress.slice(0, 5) +
                  "..." +
                  item.sellerAddress.slice(-4)
                }
                image={item.asset.image}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Collection;
