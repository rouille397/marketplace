import { TransactionResult } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MarketplaceAddr } from "../addresses";
import { useState } from "react";
import Button from "../components/Button";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
import marketplaceABI from "../helpers/marketplaceAbi.json";
import { useContract, useCreateDirectListing } from "@thirdweb-dev/react";

import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../helpers/firebase-config";

// useActiveChain, useSwitchChain, useChainId

const Create: NextPage = () => {
  // Next JS Router hook to redirect to other pages
  const router = useRouter();
  const [active, setActive] = useState("directListing");
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [directPrice, setDirectPrice] = useState("");
  const [buyoutPrice, setBuyoutPrice] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");

  const { address } = useAccount();
  const { data: signer } = useSigner();
  const provider = signer?.provider;

  const { contract } = useContract(MarketplaceAddr, "marketplace");

  function secondsBetweenDates(date: any) {
    const now: any = new Date().getTime();
    const selected = new Date(date).getTime();
    const diff = Math.abs(selected - now);
    const seconds = Math.floor(diff / 1000);
    console.log("secondsss", seconds);
    return seconds;
  }

  async function handleCreateListing(e: any) {
    try {
      e.preventDefault();
      if (!signer) return;
      // Data of the listing you want to create
      if (active === "directListing") {
        console.log("direct listing called", directPrice);
        const listing = {
          // address of the NFT contract the asset you want to list is on
          assetContractAddress: contractAddress,
          // token ID of the asset you want to list
          tokenId: tokenId,
          // when should the listing open up for offers
          startTimestamp: new Date(),
          // how long the listing will be open for
          listingDurationInSeconds: 31536000,
          // how many of the asset you want to list
          quantity: 1,
          // address of the currency contract that will be used to pay for the listing
          currencyContractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          // how much the asset will be sold for
          buyoutPricePerToken: directPrice,
        };

        console.log("listing", listing);
        if (!contract) return;

        const q1 = query(
          collection(db, "nfts"),
          where("seller", "==", address),
          where("tokenId", "==", tokenId)
        );
        const querySnapshot = await getDocs(q1);
        let alreadyListed = false;
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, "q111 => ", doc.data());
          alreadyListed = true;
        });

        if (alreadyListed) {
          alert("Already listed");
          return;
        }
        let tx: any = await contract.direct.createListing.prepare(listing);
        console.log("reached here");
        const gasLimit = await tx.estimateGasLimit(); // Estimate the gas limit
        tx.setGasLimit(Math.floor(gasLimit.toString() * 1.2));
        tx = await tx.execute(); // Execute the transaction
        const receipt = tx.receipt; // the transaction receipt
        const listingId = tx.id; // the id of the newly created listing
        console.log("receiptreceipt", receipt);
        console.log("listingIdlistingId", listingId);
        const docRef = await addDoc(collection(db, "nfts"), {
          ...listing,
          seller: address,
          category: category,
          listingId: listingId.toString(),
        });
        console.log("doc ref", docRef);
        router.push("/");
      } else {
        // Data of the auction you want to create
        const auction = {
          // address of the contract the asset you want to list is on
          assetContractAddress: contractAddress,
          // token ID of the asset you want to list
          tokenId: tokenId,
          // when should the listing open up for offers
          startTimestamp: new Date(),
          // how long the listing will be open for
          listingDurationInSeconds: secondsBetweenDates(duration),
          // how many of the asset you want to list
          quantity: 1,
          // address of the currency contract that will be used to pay for the listing
          currencyContractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          // how much people would have to bid to instantly buy the asset
          buyoutPricePerToken: buyoutPrice,
          // the minimum bid that will be accepted for the token
          reservePricePerToken: reservePrice,
        };
        console.log("auction list called", auction);
        if (!contract) return;

        const q1 = query(
          collection(db, "nfts"),
          where("seller", "==", address),
          where("tokenId", "==", tokenId)
        );
        const querySnapshot = await getDocs(q1);
        let alreadyListed = false;
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, "q111 => ", doc.data());
          alreadyListed = true;
        });

        if (alreadyListed) {
          alert("Already listed");
          return;
        }
        let tx: any = await contract.auction.createListing.prepare(auction);
        const gasLimit = await tx.estimateGasLimit(); // Estimate the gas limit
        tx.setGasLimit(Math.floor(gasLimit.toString() * 1.2));
        tx = await tx.execute(); // Execute the transaction
        const receipt = tx.receipt; // the transaction receipt
        const listingId = tx.id; // the id of the newly created listing
        console.log("receiptreceipt", receipt);
        console.log("listingIdlistingId", listingId);
        console.log("receiptreceipt", receipt);
        console.log("listingIdlistingId", listingId);
        const docRef = await addDoc(collection(db, "nfts"), {
          ...auction,
          seller: address,
          category: category,
          listingId: listingId.toString(),
        });
        console.log("doc ref", docRef);
        router.push("/");
      }

      // createDirectListing({
      //   assetContractAddress: contractAddress,
      //   buyoutPricePerToken: buyoutPrice,
      //   currencyContractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      //   listingDurationInSeconds: 60 * 60 * 24 * 7,
      //   quantity: quantity,
      //   startTimestamp: new Date(),
      //   tokenId: +tokenId,
      //   type: "NewDirectListing",
      // });
    } catch (error) {
      console.error("error", error);
    }
  }

  // async function createAuctionListing(
  //   contractAddress: string,
  //   tokenId: string,
  //   quantity: string,
  //   buyoutPrice: string,
  //   reservePrice: string,
  // ) {
  //   try {
  //     const transaction = await marketplace?.auction.createListing({
  //       assetContractAddress: contractAddress, // Contract Address of the NFT
  //       buyoutPricePerToken: buyoutPrice, // Maximum price, the auction will end immediately if a user pays this price.
  //       currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Goerli ETH.
  //       listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
  //       quantity: quantity, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
  //       reservePricePerToken: reservePrice, // Minimum price, users cannot bid below this amount
  //       startTimestamp: new Date(), // When the listing will start
  //       tokenId: +tokenId, // Token ID of the NFT.
  //     });

  //     return transaction;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // async function createDirectListing(
  //   contractAddress: string,
  //   tokenId: string,
  //   price: string,
  //   quantity: string,
  // ) {
  //   try {
  //     const transaction = await marketplace?.direct.createListing({
  //       assetContractAddress: contractAddress, // Contract Address of the NFT
  //       buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
  //       currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Goerli ETH.
  //       listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
  //       quantity: quantity, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
  //       startTimestamp: new Date(0), // When the listing will start
  //       tokenId: +tokenId, // Token ID of the NFT.
  //     });

  //     return transaction;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  return (
    <div className="px-4 pt-[80px] lg:pt-[150px] flex justify-center mb-6">
      {/* Form Section */}
      <div className="flex flex-col justify-center gap-10 items-center w-full lg:w-[50%]">
        <h1 className="conflux-text text-center text-3xl lg:text-5xl lg:mb-10 ">
          Sell your NFT to the Nitfee Market
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <Button
            type={active === "directListing" ? "square" : "transparent"}
            onClick={() => setActive("directListing")}
          >
            Direct Listing
          </Button>
          <Button
            onClick={() => setActive("auctionList")}
            type={active === "auctionList" ? "square" : "transparent"}
          >
            Auction Listing
          </Button>
        </div>

        {/* NFT Contract Address Field */}
        <input
          type="text"
          name="contractAddress"
          placeholder="NFT Contract Address"
          className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />

        {/* NFT Token ID Field */}
        <input
          required
          type="text"
          name="tokenId"
          placeholder="NFT Token ID"
          className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />

        <input
          type="text"
          name="quantity"
          placeholder="Quantity"
          className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        {/* Sale Price For Listing Field */}
        {active === "directListing" && (
          <input
            type="text"
            name="directPrice"
            placeholder="Sale Price"
            className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
            value={directPrice}
            onChange={(e) => setDirectPrice(e.target.value)}
          />
        )}

        {active === "auctionList" && (
          <input
            type="text"
            name="Buyout Price Per Token"
            placeholder="Buyout Price Per Token (How much people would have to bid to instantly buy the asset)"
            className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
            value={buyoutPrice}
            onChange={(e) => setBuyoutPrice(e.target.value)}
          />
        )}
        {/* // the minimum bid that will be accepted for the token */}
        {active === "auctionList" && (
          <input
            type="text"
            name="Reserve Price Per Token"
            placeholder="Reserve Price Per Token (The minimum bid that will be accepted for the token)"
            className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
            value={reservePrice}
            onChange={(e) => setReservePrice(e.target.value)}
          />
        )}

        {active !== "directListing" && (
          <input
            required
            type="date"
            name="duration"
            placeholder="Duration"
            className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        )}

        {/* make a select options input for nft categories */}

        <select
          name="category"
          id="category"
          className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Art">Art</option>
          <option value="Gaming">Gaming</option>
          <option value="Sports">Sports</option>
          <option value="Photography">Photography</option>
          <option value="Music">Music</option>
          <option value="Virtual Worlds">Virtual Worlds</option>
        </select>
        <button
          onClick={(e) => handleCreateListing(e)}
          className="walletConnectButton px-[36px] py-3 rounded-xl text-white"
        >
          List NFT
        </button>
      </div>
    </div>
  );
};

export default Create;
