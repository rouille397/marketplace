import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import NftCard from "../../components/NftCard";
import { db } from "../../helpers/firebase-config";
import creatorImage from "../../public/images/creator-image.png";

const creator = () => {
  const [collectionData, setCollectionData] = useState([]);
  const [collectionDataLoading, setCollectionDataLoading] = useState(false);
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!address) return;
    (async () => {
      setCollectionDataLoading(true);
      const collectionRef = collection(db, "collections");
      const q = query(
        collectionRef,
        where("creator", "==", address),
        orderBy("createdAt", "desc")
      );
      const collectionSnapshot = await getDocs(q);
      const collectionList = collectionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("collectionList", collectionList);
      setCollectionDataLoading(false);
      setCollectionData(collectionList);
    })();
  }, [address]);

  // get collection data from firbase using address

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
      <div className="px-4 py-6 lg:px-[75px] lg:py-[120px]">
        <div className="w-full h-[300px] bg-[#16192A] border-[2px] border-[#2E3150] rounded-[10px] flex justify-center items-end">
          <div className="relative top-[100px] text-center">
            <Image
              src={creatorImage}
              alt="Nitee marketplace"
              width={240}
              height={240}
              className=""
            />
            <h1 className="text-textLight font-extrabold text-[22px]">
              {address && address.slice(0, 5) + "..." + address.slice(-4)}
            </h1>
            <p className="text-[#989898] text-lg font-semibold">@laural123</p>
          </div>
        </div>
        <div className="mt-[120px] md:mt-[250px] grid md:grid-cols-3 min-[1380px]:grid-cols-4 gap-4 ">
          {collectionData.map((item) => (
            <div
              className="cursor-pointer"
              onClick={() =>
                router.push({
                  pathname: "/create",
                  query: { colectionAddr: item.collectionAddress },
                })
              }
            >
              <NftCard
                key={item.id}
                name={item.name}
                price={item.nfts.length}
                symbol={"listings"}
                user={
                  item.collectionAddress.slice(0, 5) +
                  "..." +
                  item.collectionAddress.slice(-4)
                }
                image={item.image}
                onClick={() => {}}
                type="List NFTs"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default creator;
