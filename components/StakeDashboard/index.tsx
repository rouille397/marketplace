import React, { FC, useEffect, useState } from "react";
import NftCard from "../NftCard";
import lightningHand from "../../public/images/lightning-hand.png";
import Image from "next/image";
import styles from "../../styles/Dashboard.module.css";
import {
  getContract,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useOwnedNFTs,
  useSDK,
  useSigner,
} from "@thirdweb-dev/react";
import {
  BRONZE_NFT_ADDRESS,
  BRONZE_STAKING_ADDRESS,
  GOLD_NFT_ADDRESS,
  GOLD_STAKING_ADDRESS,
  SILVER_NFT_ADDRESS,
  SIVER_STAKING_ADDRESS,
} from "@/addresses";
import { ethers } from "ethers";

const StakeDashboard: FC = () => {
  const signer = useSigner();
  const provider = signer?.provider;
  const address = useAddress();

  const [activeBtn, setActiveBtn] = useState<number>(0);
  const [selectedNft, setSelectedNft] = useState<string>("");
  const [goldStakeInfo, setGoldStakeInfo] = useState<any>({});
  const [silverStakeInfo, setSilverStakeInfo] = useState<any>({});
  const [bronzeStakeInfo, setBronzeStakeInfo] = useState<any>({});

  // nft staking contract address
  const { contract: goldStakingContract } = useContract(GOLD_STAKING_ADDRESS);
  const { contract: silverStakingContract } = useContract(SIVER_STAKING_ADDRESS);
  const { contract: bronzeStakingContract } = useContract(BRONZE_STAKING_ADDRESS);

  // nft contact address
  const { contract: goldNftContract } = useContract(GOLD_NFT_ADDRESS);
  const { contract: silverNftContract } = useContract(SILVER_NFT_ADDRESS);
  const { contract: bronzeNftContract } = useContract(BRONZE_NFT_ADDRESS);

  // owned nfts read
  const { data: goldOwnedNfts, isLoading: goldOwnedNftsLoading } = useOwnedNFTs(
    goldNftContract,
    address,
  );
  const { data: silverOwnedNfts, isLoading: silverOwnedNftsLoading } = useOwnedNFTs(
    silverNftContract,
    address,
  );
  const { data: bronzeOwnedNfts, isLoading: bronzeOwnedNftsLoading } = useOwnedNFTs(
    bronzeNftContract,
    address,
  );

  // approve for all read
  const { data: goldNftRead, isLoading: goldApproveLoading } = useContractRead(
    goldNftContract,
    "isApprovedForAll",
    [address, GOLD_NFT_ADDRESS],
  );
  const { data: silverNftRead, isLoading: silverApproveLoading } = useContractRead(
    silverNftContract,
    "isApprovedForAll",
    [address, SILVER_NFT_ADDRESS],
  );
  const { data: bronzeNftRead, isLoading: bronzeApproveLoading } = useContractRead(
    bronzeNftContract,
    "isApprovedForAll",
    [address, BRONZE_NFT_ADDRESS],
  );

  //stake write
  const { mutateAsync: setApprovalForAllGold } = useContractWrite(goldNftContract, "stake");
  const { mutateAsync: setApprovalForAllSilver } = useContractWrite(silverNftContract, "stake");
  const { mutateAsync: setApprovalForAllBronze } = useContractWrite(bronzeNftContract, "stake");

  // unstake read

  useEffect(() => {
    if (!provider || !address) return;
    (async () => {
      const goldStakingContract = new ethers.Contract(GOLD_STAKING_ADDRESS, abi, provider);
      let updatedGoldStakingContract = await goldStakingContract.getStakeInfo(address);
      updatedGoldStakingContract = updatedGoldStakingContract._tokensStaked.map((item: any) =>
        item.toString(),
      );
      setGoldStakeInfo(updatedGoldStakingContract);

      const silverStakingContract = new ethers.Contract(SIVER_STAKING_ADDRESS, abi, provider);
      let updatedSilverStakingContract = await silverStakingContract.getStakeInfo(address);
      updatedSilverStakingContract = updatedSilverStakingContract._tokensStaked.map((item: any) =>
        item.toString(),
      );
      setSilverStakeInfo(updatedSilverStakingContract);

      const bronzeStakingContract = new ethers.Contract(BRONZE_STAKING_ADDRESS, abi, provider);
      let updatedBronzeStakingContract = await bronzeStakingContract.getStakeInfo(address);
      updatedBronzeStakingContract = updatedBronzeStakingContract._tokensStaked.map((item: any) =>
        item.toString(),
      );
      setBronzeStakeInfo(updatedBronzeStakingContract);
      console.log(
        "updatedGoldStakingContract",
        updatedGoldStakingContract,
        updatedSilverStakingContract,
        updatedBronzeStakingContract,
      );
    })();
  }, [provider, address]);

  // const { data: goldStakeValue } = useContractRead(goldStakingContract, "getStakeInfo", [address]);
  // const { data: silverStakeValue } = useContractRead(silverStakingContract, "getStakeInfo", [
  //   address,
  // ]);
  // const { data: bronzeStakeValue } = useContractRead(bronzeStakingContract, "getStakeInfo", [
  //   address,
  // ]);

  const handleClick = (btnId: number) => {
    setActiveBtn(btnId);
  };

  const handleCancelClick = () => {
    setActiveBtn(0);
  };

  let selectedNftImage = "";
  let calculateAnualInterest = 50;
  let calculateDailyInterest = 0.2;
  let calculateUnstakeVaule = 0;
  let calculateNftsValue = goldOwnedNfts?.length || 0;

  if (selectedNft === "gold") {
    selectedNftImage = "/images/gold.jpeg";
    calculateAnualInterest = 50;
    calculateNftsValue = goldOwnedNfts?.length || 0;
    calculateDailyInterest = 0.2;
    calculateUnstakeVaule = goldStakeInfo?.length || 0;
  }
  if (selectedNft === "silver") {
    selectedNftImage = "/images/silver.png";
    calculateAnualInterest = 30;
    calculateNftsValue = silverOwnedNfts?.length || 0;
    calculateDailyInterest = 0.095;
    calculateUnstakeVaule = silverStakeInfo?.length || 0;
  }
  if (selectedNft === "bronze") {
    selectedNftImage = "/images/bronze.jpeg";
    calculateAnualInterest = 20;
    calculateNftsValue = bronzeOwnedNfts?.length || 0;
    calculateDailyInterest = 0.045;
    calculateUnstakeVaule = bronzeStakeInfo?.length || 0;
  }

  return (
    <React.Fragment>
      <section className="lg:px-[78px] px-4">
        <div className={`mx-auto lg:p-[102px] p-4 relative rounded-[20px] ${styles.stakeInsights}`}>
          <div className="flex xl:flex-row justify-center gap-16 flex-wrap">
            <div className="  space-y-12">
              <Image
                src={selectedNftImage || "/images/gold.jpeg"}
                alt="nitfee"
                className="rounded-md"
                width={397}
                height={475}
              />
              <h1 className="text-center text-white text-3xl font-bold tracking-widest">
                {selectedNft?.toUpperCase() || "GOLD"} NFT
              </h1>
            </div>
            <div className="md:space-y-[86px] space-y-8">
              <div className="text-center space-y-4">
                <p className="text-lg font-semibold text-white uppercase">
                  EST. STAKING RETURN (APY){" "}
                </p>
                <span className="text-4xl font-bold text-white block ">
                  {calculateAnualInterest || "50"}%
                </span>
              </div>
              {/* 1st btn */}
              <div className="text-center space-y-5">
                {activeBtn !== 1 && (
                  <>
                    <p className="text-lg font-semibold text-white">Balance</p>
                    <span className="text-4xl font-bold text-white block ">
                      {calculateNftsValue}
                    </span>
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
                  EST. DAILY INTREST (CFX)
                </p>
                <span className="text-4xl font-bold text-white block ">
                  {calculateDailyInterest}
                </span>
              </div>
              {/* 3rd btn */}
              <div className="text-center space-y-5">
                {activeBtn !== 3 && (
                  <>
                    <p className="text-lg font-semibold text-white">Balance</p>
                    <span className="text-4xl font-bold text-white block ">
                      {calculateUnstakeVaule}
                    </span>
                    <button
                      className="stake-btn text-white block w-full font-semibold py-3 px-6 rounded-lg"
                      onClick={() => handleClick(3)}
                    >
                      Unstake
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
        <div className="mt-[32px] md:mt-[70px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div
            className="rounded-lg w-full h-full group cursor-pointer relative"
            onClick={() => {
              setSelectedNft("gold");
            }}
          >
            <img
              src={"/images/gold.jpeg"}
              className="w-full h-full object-cover rounded-md"
              alt="marketplan"
            />
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent hidden justify-center items-center group-hover:flex cursor-pointer">
              <div className="text-center">
                <p className="font-semibold md:text-3xl text-base ">Gold</p>
                <p className="text-white md:text-[18px] text-sm font-semibold">
                  {goldOwnedNfts?.length} NFTs
                </p>
              </div>
            </div>
          </div>
          <div
            className="rounded-lg w-full h-full group cursor-pointer relative"
            onClick={() => setSelectedNft("silver")}
          >
            <img
              src={"/images/silver.png"}
              className="w-full h-full object-cover rounded-md"
              alt="marketplan"
            />
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent hidden justify-center items-center group-hover:flex cursor-pointer">
              <div className="text-center">
                <p className="font-semibold md:text-3xl text-base ">Silver</p>
                <p className="text-white md:text-[18px] text-sm font-semibold">
                  {silverOwnedNfts?.length} NFTs
                </p>
              </div>
            </div>
          </div>
          <div
            className="rounded-lg w-full h-full group cursor-pointer relative"
            onClick={() => setSelectedNft("bronze")}
          >
            <img
              src={"/images/bronze.jpeg"}
              className="w-full h-full object-cover rounded-md"
              alt="marketplan"
            />
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent hidden justify-center items-center group-hover:flex cursor-pointer">
              <div className="text-center">
                <p className="font-semibold md:text-3xl text-base ">Bronze</p>
                <p className="text-white md:text-[18px] text-sm font-semibold">
                  {bronzeOwnedNfts?.length} NFTs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default StakeDashboard;

const abi = [
  {
    inputs: [{ internalType: "address", name: "_staker", type: "address" }],
    name: "getStakeInfo",
    outputs: [
      { internalType: "uint256[]", name: "_tokensStaked", type: "uint256[]" },
      { internalType: "uint256", name: "_rewards", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];
