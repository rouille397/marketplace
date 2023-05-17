import React, { useState } from "react";
import Button from "../components/Button";
import stakeHandImage from "../public/images/stake-hand-img.png";
import lightningHand from "../public/images/lightning-hand.png";
import Image from "next/image";
import styles from "../styles/Dashboard.module.css";
import NftCard from "@/components/NftCard";
import StakeDashboard from "@/components/StakeDashboard";

const stakeCategories = ["stake", "un-stake", "claim", "un-claimed points"];

export default function Dashboard() {
  const [selectedType, setSelectedType] = useState<any>(null);

  return (
    <React.Fragment>
      {/* hero */}
      <div className="flex flex-col overflow-hidden justify-center bg-[url('/images/stake-hero-img.png')] bg-cover min-[1440px]:bg-cover bg-no-repeat h-[700px] lg:h-[884px] xl:min-h-[884px] lg:px-48 px-4 relative">
        <div
          className={`absolute w-[803px] h-[600px] left-[100px] lg:left-[329px] ${styles.heroShadow}`}
        ></div>
        <Image
          src={stakeHandImage}
          alt=""
          className="z-[2] absolute bottom-24 lg:-bottom-20 left-0"
        />
        <h1 className="uppercase text-[100px] lg:text-[200px] leading-[85px] text-center lg:text-left font-bold  stake-text md:leading-[230px] relative z-[3]">
          STAKE
        </h1>
        <h1 className="lg:text-[180px] text-[96px] text-center leading- lg:text-left font-bold nft-text  md:leading-[200px] relative z-[3]">
          your NFT
        </h1>
      </div>
      <div
        className={`relative z-[5] w-full h-[587px] -mt-[500px] lg:-mt-[400px] flex items-end px-4 lg:px-48 ${styles.textAfterHero}`}
      >
        <h2 className="font-semibold text-[20px] text-center lg:text-left lg:text-[27px] text-white">
          Explore rare and valuable digital assets on our NFT marketplace. Buy, sell, and earn
          rewards with low fees and an easy-to-use platform. Join our community of NFT enthusiasts
          today.
        </h2>
      </div>
      {/* stake categories */}
      <div className="flex justify-start lg:justify-center items-center gap-5 md:mb-24 mb-12 overflow-x-scroll mt-12 md:mt-20 px-4">
        {stakeCategories?.map((category, index) =>
          index === stakeCategories.length - 1 ? (
            <Button
              type="rounded"
              className="whitespace-nowrap flex items-center gap-4 uppercase"
              onClick={() => {
                category === "stake" ? setSelectedType(null) : setSelectedType(category);
              }}
            >
              {category}
              <span className={`w-[269px] h-2 ${styles.progressBar}`}></span>
              <span className="pr-10">699</span>
            </Button>
          ) : (
            <Button
              type="rounded"
              className="uppercase w-[168px]"
              onClick={() => {
                category === "stake" ? setSelectedType(null) : setSelectedType(category);
              }}
            >
              {category}
            </Button>
          ),
        )}
      </div>
      {/* stake insights */}
      <StakeDashboard />

      {/* Burn tokens */}
      <section className="px-4 lg:px-[133px] mt-24 mb-40">
        <div className="bg-no-repeat flex-col items-center space-y-5 md:space-y-10 md:p-9 p-4 text-center relative bg-[#11171D]/80 md:bg-[url('/images/burn-token.jpg')] bg-cover rounded-[20px] md:min-h-[302px]">
          <div className="absolute inset-0 bg-black/80 md:flex hidden z-[6]"></div>
          <h2 className="uppercase text-2xl md:text-4xl md:relative md:z-[7] text-bold">
            BURN $INFKT TOKENS HERE:
          </h2>
          <button className="stake-btn text-[#141B22] md:relative md:z-[7] text-base font-semibold py-3 px-6 rounded-lg uppercase">
            convert to points
          </button>
          <p className="text-base font-normal md:relative md:z-[7]">
            In the next chapter, your treasured $INFKT tokens transform into points, amplifying your
            power and influence. This conversion opens doors to exclusive experiences, granting you
            access to uncharted territories and hidden treasures within the INFKTED ecosystem..
          </p>
        </div>
      </section>
    </React.Fragment>
  );
}
