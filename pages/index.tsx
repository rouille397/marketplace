import React, { useState, useEffect } from "react";
import Headers from "../components/Header";
import Button from "../components/Button";
import Head from "next/head";
import NftCarousel from "../components/NftCarousel";
import Loading from "../components/Loading";
import Image from "next/image";
import starIcon from "../public/images/star.svg";
import circleIcon from "../public/images/circle.svg";
import NftStep from "../components/NftStep";
import { CATEGORIES, NFT_STEPS } from "../constants";

import {
  query,
  where,
  collection,
  getDocs,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "@/helpers/firebase-config";
import Link from "next/link";
import Contact from "@/components/Contact";

export default function Home() {
  const [recentlyAdded, setRecentlyAdded] = useState<any>([]);
  const [recentlySold, setRecentlySold] = useState<any>([]);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [recentlyAddedLoading, setRecentlyAddedLoading] = useState(false);
  const [recentlySoldLoading, setRecentlySoldLoading] = useState(false);
  const [allCollectionLoading, setAllCollectionLoading] = useState(false);
  const [allCollectionsData, setAllCollectionsData] = useState<any>([]);

  //recently listed
   useEffect(() => {
    (async () => {
      setRecentlyAddedLoading(true);
      const nftsRef = collection(db, "nfts");
      const q = query(nftsRef, orderBy("listingId", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      const nfts = querySnapshot.docs.map((doc) => doc.data());
      console.log("nftsss", nfts);
      setRecentlyAdded(nfts);
      setRecentlyAddedLoading(false);
    })();
  }, []);

  // //this useEffect will find recently sold NFTS
  useEffect(() => {
    (async () => {
      setRecentlySoldLoading(true);
      // get nfts from nfts collection in firebase where soldAt exists, get them in descending order
      const nftsRef = collection(db, "nfts");
      const q = query(
        nftsRef,
        where("soldAt", "!=", null),
        orderBy("soldAt", "desc"),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const nfts = querySnapshot.docs.map((doc) => doc.data());
      console.log("nftssoldout", nfts);
      setRecentlySold(nfts);
      setRecentlySoldLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedType) {
        setAllCollectionLoading(true);
        const collectionRef = collection(db, "collections");
        const q = query(collectionRef, orderBy("createdAt", "desc"), limit(10));
        const collectionSnapshot = await getDocs(q);
        const collectionList = collectionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllCollectionsData(collectionList);
        setAllCollectionLoading(false);
      }
      if (selectedType) {
        setAllCollectionLoading(true);
        const collectionRef = collection(db, "collections");
        const q = query(
          collectionRef,
          where("category", "==", selectedType),
          orderBy("buyoutPricePerToken", "asc"),
          limit(10)
        );
        const collectionSnapshot = await getDocs(q);
        const collectionList = collectionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllCollectionsData(collectionList);
        setAllCollectionLoading(false);
      }
    })();
  }, [selectedType]);
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
        <div
          className={`px-6 my-[60px] lg:my-[120px] md:px-[75px] ${
            allCollectionsData.length == 0 ? "min-h-[300px]" : "min-h-[600px]"
          } `}
        >
          <h1 className="text-[32px] lg:text-[59px] font-semibold text-white text-center mb-12">
            Explore Marketplace
          </h1>
          <div className="flex justify-start lg:justify-center items-center gap-5 md:mb-12 mb-8 overflow-x-scroll ">
            {CATEGORIES?.map((category) => (
              <Button
                key={category}
                type="rounded"
                className="md:w-auto"
                onClick={() => {
                  category == "All"
                    ? setSelectedType(null)
                    : setSelectedType(category);
                }}
              >
                {category}
              </Button>
            ))}
          </div>

          {allCollectionLoading ? (
            <Loading isLoading={allCollectionLoading} />
          ) : (
            // <div className="flex flex-col md:gap-6 gap-3 md:mt-20 items-center justify-center">
            //   <div className="flex w-full md:gap-6 gap-3 md:flex-row flex-col">
            //     {allCollectionsData[0] && (
            //       // show listing count when we hover over parent
            //       <Link
            //         href={`/collection/${allCollectionsData[0]?.collectionAddress?.toLowerCase()}`}
            //       >
            //         <div className="md:flex-1 md:h-72 h-40 rounded-lg relative group ">
            //           <img
            //             src={allCollectionsData[0]?.image}
            //             className="w-full h-full object-cover"
            //             alt="marketplan"
            //           />
            //           {/* show listing count which is collection.nfts.length when hover over parent */}
            //           <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent hidden justify-center items-center group-hover:flex cursor-pointer">
            //             <div className="text-center">
            //               <p className="font-semibold md:text-2xl text-base ">
            //                 {allCollectionsData[0]?.name}
            //               </p>
            //               <p className="text-white md:text-[18px] text-sm font-semibold">
            //                 {allCollectionsData[0]?.nfts?.length} Listings
            //               </p>
            //             </div>
            //           </div>
            //         </div>
            //       </Link>
            //     )}
            //     {allCollectionsData[0] && (
            //       <Link
            //         href={`/collection/${allCollectionsData[1]?.collectionAddress?.toLowerCase()}`}
            //       >
            //         <div className="md:flex-1 md:h-72 h-40 rounded-lg relative group ">
            //           {allCollectionsData[1]?.image && (
            //             <>
            //               <img
            //                 src={allCollectionsData[1]?.image}
            //                 className="w-full h-full object-cover"
            //                 alt="marketplan"
            //               />
            //               {/* show listing count which is collection.nfts.length when hover over parent */}
            //               <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent hidden justify-center items-center group-hover:flex cursor-pointer">
            //                 <div className="text-center">
            //                   <p className="font-semibold md:text-2xl text-base ">
            //                     {allCollectionsData[1]?.name}
            //                   </p>
            //                   <p className="text-white md:text-[18px] text-sm font-semibold">
            //                     {allCollectionsData[1]?.nfts?.length} Listings
            //                   </p>
            //                 </div>
            //               </div>
            //             </>
            //           )}
            //         </div>
            //       </Link>
            //     )}
            //   </div>
            //   {allCollectionsData[2] && (
            //     <div className="justify-center grid md:grid-cols-3 grid-cols-2 md:grid-rows-1 grid-rows-2 w-full md:h-72 md:gap-6 gap-3 h-72 ">
            //       {allCollectionsData[2] && (
            //         <Link
            //           href={`/collection/${allCollectionsData[2]?.collectionAddress?.toLowerCase()}`}
            //         >
            //           <div className="rounded-lg w-full h-full group cursor-pointer relative">
            //             <img
            //               src={allCollectionsData[2]?.image}
            //               className="w-full h-full object-cover"
            //               alt="marketplan"
            //             />

            //             {/* show listing count which is collection.nfts.length when hover over parent */}
            //             <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent hidden justify-center items-center group-hover:flex cursor-pointer">
            //               <div className="text-center">
            //                 <p className="font-semibold md:text-2xl text-base ">
            //                   {allCollectionsData[2]?.name}
            //                 </p>
            //                 <p className="text-white md:text-[18px] text-sm font-semibold">
            //                   {allCollectionsData[2]?.nfts?.length} Listings
            //                 </p>
            //               </div>
            //             </div>
            //           </div>
            //         </Link>
            //       )}
            //       {allCollectionsData[3] && (
            //         <Link
            //           href={`/collection/${allCollectionsData[3]?.collectionAddress?.toLowerCase()}`}
            //         >
            //           <div className="rounded-lg w-full h-full group cursor-pointer relative">
            //             <img
            //               src={allCollectionsData[3]?.image}
            //               className="w-full h-full object-cover"
            //               alt="marketplan"
            //             />
            //             <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent hidden justify-center items-center group-hover:flex cursor-pointer">
            //               <div className="text-center">
            //                 <p className="font-semibold md:text-2xl text-base ">
            //                   {allCollectionsData[3]?.name}
            //                 </p>
            //                 <p className="text-white md:text-[18px] text-sm font-semibold">
            //                   {allCollectionsData[3]?.nfts.length} Listings
            //                 </p>
            //               </div>
            //             </div>
            //           </div>
            //         </Link>
            //       )}
            //       {allCollectionsData[4] && (
            //         <Link
            //           href={`/collection/${allCollectionsData[4]?.collectionAddress?.toLowerCase()}`}
            //         >
            //           <div className="rounded-lg w-full h-full group cursor-pointer relative">
            //             <img
            //               src={allCollectionsData[4]?.image}
            //               className="w-full h-full object-cover"
            //               alt="marketplan"
            //             />
            //             <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent hidden justify-center items-center group-hover:flex cursor-pointer">
            //               <div className="text-center">
            //                 <p className="font-semibold md:text-2xl text-base ">
            //                   {allCollectionsData[4]?.name}
            //                 </p>
            //                 <p className="text-white md:text-[18px] text-sm font-semibold">
            //                   {allCollectionsData[4]?.nfts?.length} Listings
            //                 </p>
            //               </div>
            //             </div>
            //           </div>
            //         </Link>
            //       )}
            //       {allCollectionsData[5] && (
            //         <Link
            //           href={`/collection/${allCollectionsData[5]?.collectionAddress?.toLowerCase()}`}
            //         >
            //           <div className="bg-stone-200 rounded-lg md:hidden  w-full h-full group">
            //             <img
            //               src={allCollectionsData[5]?.image}
            //               className="w-full h-full object-cover"
            //               alt="marketplan"
            //             />
            //             <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent hidden justify-center items-center group-hover:flex cursor-pointer">
            //               <div className="text-center">
            //                 <p className="font-semibold md:text-2xl text-base ">
            //                   {allCollectionsData[5]?.name}
            //                 </p>
            //                 <p className="text-white md:text-[18px] text-sm font-semibold">
            //                   {allCollectionsData[5]?.nfts?.length} Listings
            //                 </p>
            //               </div>
            //             </div>
            //           </div>
            //         </Link>
            //       )}
            //     </div>
            //   )}
            // </div>

            // show first 8 collections in grid view, large screen has 4 columns and small screen has 2 columns
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-[450px]">
              {allCollectionsData?.map((collection: any, index: any) => {
                return (
                  <Link
                    href={`/collection/${collection?.collectionAddress?.toLowerCase()}`}
                  >
                    <div className="rounded-lg w-full h-full group cursor-pointer relative">
                      <img
                        src={collection?.image}
                        className="w-full h-full object-cover rounded-md"
                        alt="marketplan"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent hidden justify-center items-center group-hover:flex cursor-pointer">
                        <div className="text-center">
                          <p className="font-semibold md:text-2xl text-base ">
                            {collection?.name}
                          </p>
                          <p className="text-white md:text-[18px] text-sm font-semibold">
                            {collection?.nfts?.length} Listings
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {allCollectionsData.length == 0 && !allCollectionLoading && (
            <p className="text-center relative top-10">no collection to show</p>
          )}
          {/* TODO change it */}
          {!allCollectionLoading && allCollectionsData.length > 3 && (
            <div className="text-center mt-12">
              <Link href="/collection/all">
                <Button type="rounded">View More</Button>
              </Link>
            </div>
          )}
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
            <div className="max-h-[500px] overflow-hidden">
              <NftCarousel listing={recentlySold} />
            </div>
          )}
        </div>
        {/* Contact us */}
        <div className="md:my-[120px] my-[60px] md:px-[75px] px-5">
          <Contact />
        </div>
      </div>
    </>
  );
}
