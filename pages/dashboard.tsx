import React, { useState } from "react";
import Button from "../components/Button";
import stakeHandImage from "../public/images/stake-hand-img.png";
import lightningHand from "../public/images/lightning-hand.png";
import Image from "next/image";
import styles from "../styles/Dashboard.module.css";
import NftCard from "@/components/NftCard";

const stakeCategories = ["stake", "un-stake", "claim", "un-claimed points"];

export default function Dashboard() {
  const [selectedType, setSelectedType] = useState<any>(null);

  return (
    <React.Fragment>
      {/* hero */}
      <div className="flex flex-col overflow-hidden justify-center bg-[url('/images/stake-hero-img.png')] bg-cover min-[1440px]:bg-cover bg-no-repeat h-[884px] xl:min-h-[884px] lg:px-48 px-4 relative">
        <div className={`absolute w-[803px] h-[600px] ${styles.heroShadow}`}></div>
        <Image
          src={stakeHandImage}
          alt=""
          className="z-[2] absolute bottom-6 md:-bottom-20 left-0"
        />
        <h1 className="uppercase text-[130px] md:text-[200px] text-center lg:text-left font-bold leading-[120px] stake-text md:leading-[230px] relative z-[3]">
          STAKE
        </h1>
        <h1 className="md:text-[180px] text-[120px] text-center lg:text-left font-bold nft-text leading-[140px] md:leading-[200px] relative z-[3]">
          your NFT
        </h1>
      </div>
      <div
        className={`relative z-[5] w-full h-[587px] -mt-[500px] md:-mt-[400px] flex items-end px-4 lg:px-48 ${styles.textAfterHero}`}
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
      <section className="px-[78px]">
        <div className={`mx-auto p-[102px] relative rounded-[20px] ${styles.stakeInsights}`}>
          <div className="flex xl:flex-row justify-center gap-16 flex-wrap">
            <div className="  space-y-12">
              <Image src={lightningHand} alt="" className="" />
              <h1 className="text-center text-white text-3xl font-bold tracking-widest">
                Ligthing Hand
              </h1>
            </div>
            <div className="  space-y-[86px]">
              <div className="text-center space-y-4">
                <p className="text-lg font-semibold text-white uppercase">
                  EST. STAKING RETURN (ARP){" "}
                </p>
                <span className="text-4xl font-bold text-white block ">10%</span>
              </div>
              <div className="text-center space-y-5">
                <p className="text-lg font-semibold text-white">Balance</p>
                <span className="text-4xl font-bold text-white block ">10%</span>
                <button className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg">
                  Stake
                </button>
              </div>
              <div className="text-center space-y-5">
                <p className="text-lg font-semibold text-white ">Burnable</p>
                <span className="text-4xl font-bold text-white block ">27</span>
                <button className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg">
                  Stake
                </button>
              </div>
            </div>
            <div className=" space-y-[86px]">
              <div className="text-center space-y-4">
                <p className="text-lg font-semibold text-white uppercase">
                  EST. DAILY INTREST (USFC){" "}
                </p>
                <span className="text-4xl font-bold text-white block ">10%</span>
              </div>
              <div className="text-center space-y-5">
                <p className="text-lg font-semibold text-white">Staking</p>
                <span className="text-4xl font-bold text-white block ">18.09 </span>
                <button className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg">
                  Unstake
                </button>
              </div>
              <div className="text-center space-y-5">
                <p className="text-lg font-semibold text-white ">Total Interests (UDSC) </p>
                <span className="text-4xl font-bold text-white block ">27</span>
                <button className="stake-btn text-white font-semibold py-3 px-6 block w-full rounded-lg">
                  Unstake
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* stake cards */}
        <div className="flex flex-wrap gap-[70px] justify-center mt-24">
          {Array.from({ length: 3 }).map((_, i) => (
            <NftCard
              name="Sam"
              price="100CFX"
              symbol={""}
              user="137x3738"
              image="images/card1.png"
              type={undefined}
              onClick={function (): void {
                throw new Error("Function not implemented.");
              }}
              key={i}
            />
          ))}
        </div>
      </section>

      {/* Burn tokens */}
      <section className="px-4 lg:px-[133px] mt-24 mb-40">
        <div className="bg-no-repeat relative bg-[url('/images/burn-token.jpg')] bg-cover rounded-[20px] h-[350px] md:h-[302px]">
          <div className="absolute bg-black/80 inset-0 flex flex-col items-center space-y-10 p-9 text-center">
            <h2 className="uppercase text-2xl md:text-4xl text-bold">BURN $INFKT TOKENS HERE:</h2>
            <button className="stake-btn text-[#141B22] text-base font-semibold py-3 px-6 rounded-lg uppercase">
              convert to points
            </button>
            <p className="text-base font-normal">
              In the next chapter, your treasured $INFKT tokens transform into points, amplifying
              your power and influence. This conversion opens doors to exclusive experiences,
              granting you access to uncharted territories and hidden treasures within the INFKTED
              ecosystem..
            </p>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
