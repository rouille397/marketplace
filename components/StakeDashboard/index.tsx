import React, { FC, useState } from "react";
import NftCard from "../NftCard";
import lightningHand from "../../public/images/lightning-hand.png";
import Image from "next/image";
import styles from "../../styles/Dashboard.module.css";

const StakeDashboard: FC = () => {
  const [activeBtn, setActiveBtn] = useState<number>(0);

  const handleClick = (btnId: number) => {
    setActiveBtn(btnId);
  };

  const handleCancelClick = () => {
    setActiveBtn(0);
  };
  return (
    <React.Fragment>
      <section className="lg:px-[78px] px-4">
        <div className={`mx-auto lg:p-[102px] p-4 relative rounded-[20px] ${styles.stakeInsights}`}>
          <div className="flex xl:flex-row justify-center gap-16 flex-wrap">
            <div className="  space-y-12">
              <Image src={lightningHand} alt="" className="" />
              <h1 className="text-center text-white text-3xl font-bold tracking-widest">
                Ligthing Hand
              </h1>
            </div>
            <div className="md:space-y-[86px] space-y-8">
              <div className="text-center space-y-4">
                <p className="text-lg font-semibold text-white uppercase">
                  EST. STAKING RETURN (ARP){" "}
                </p>
                <span className="text-4xl font-bold text-white block ">10%</span>
              </div>
              {/* 1st btn */}
              <div className="text-center space-y-5">
                {activeBtn !== 1 && (
                  <>
                    <p className="text-lg font-semibold text-white">Balance</p>
                    <span className="text-4xl font-bold text-white block ">10%</span>
                    <button
                      className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg"
                      onClick={() => handleClick(1)}
                    >
                      Stake
                    </button>
                  </>
                )}
                {activeBtn === 1 && (
                  <>
                    <label htmlFor="" className="flex justify-between items-center">
                      <span>Balance</span>
                      <span>27</span>
                    </label>
                    <input type="text" className="py-[10px] bg-[#11171D] w-full" />
                    <div className="flex items-center justify-between gap-5">
                      <button className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg">
                        Stake
                      </button>
                      <button
                        className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* 2nd btn */}
              <div className="text-center space-y-5">
                {activeBtn !== 2 && (
                  <>
                    <p className="text-lg font-semibold text-white">Balance</p>
                    <span className="text-4xl font-bold text-white block ">10%</span>
                    <button
                      className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg"
                      onClick={() => handleClick(2)}
                    >
                      Stake
                    </button>
                  </>
                )}
                {activeBtn === 2 && (
                  <>
                    <label htmlFor="" className="flex justify-between items-center">
                      <span>Balance</span>
                      <span>27</span>
                    </label>
                    <input type="text" className="py-[10px] bg-[#11171D] w-full" />
                    <div className="flex items-center justify-between gap-5">
                      <button className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg">
                        Stake
                      </button>
                      <button
                        className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="md:space-y-[86px] space-y-8">
              <div className="text-center space-y-4">
                <p className="text-lg font-semibold text-white uppercase">
                  EST. DAILY INTREST (USFC){" "}
                </p>
                <span className="text-4xl font-bold text-white block ">10%</span>
              </div>
              {/* 3rd btn */}
              <div className="text-center space-y-5">
                {activeBtn !== 3 && (
                  <>
                    <p className="text-lg font-semibold text-white">Balance</p>
                    <span className="text-4xl font-bold text-white block ">10%</span>
                    <button
                      className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg"
                      onClick={() => handleClick(3)}
                    >
                      Stake
                    </button>
                  </>
                )}
                {activeBtn === 3 && (
                  <>
                    <label htmlFor="" className="flex justify-between items-center">
                      <span>Balance</span>
                      <span>27</span>
                    </label>
                    <input type="text" className="py-[10px] bg-[#11171D] w-full" />
                    <div className="flex items-center justify-between gap-5">
                      <button className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg">
                        Stake
                      </button>
                      <button
                        className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="text-center space-y-5">
                {activeBtn !== 4 && (
                  <>
                    <p className="text-lg font-semibold text-white">Balance</p>
                    <span className="text-4xl font-bold text-white block ">10%</span>
                    <button
                      className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg"
                      onClick={() => handleClick(4)}
                    >
                      Stake
                    </button>
                  </>
                )}
                {activeBtn === 4 && (
                  <>
                    <label htmlFor="" className="flex justify-between items-center">
                      <span>Balance</span>
                      <span>27</span>
                    </label>
                    <input type="text" className="py-[10px] bg-[#11171D] w-full" />
                    <div className="flex items-center justify-between gap-5">
                      <button className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg">
                        Stake
                      </button>
                      <button
                        className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* stake cards */}
        <div className="flex flex-wrap gap-[70px] justify-center lg:mt-24 mt-16">
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
    </React.Fragment>
  );
};

export default StakeDashboard;
