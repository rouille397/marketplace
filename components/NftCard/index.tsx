import { MediaRenderer } from "@thirdweb-dev/react";
import Image from "next/image";
import React, { FC } from "react";
import Button from "../Button";

interface INftCardProps {
  name: string | number | null | undefined;
  price: string | number | null | undefined;
  symbol: string;
  image: string | null | undefined;
}

const NftCard: FC<INftCardProps> = ({ name, image, price, symbol }) => {
  return (
    <div className="nft-card flex flex-col items-center gap-[27px] px-[10px] py-[15px]  w-[297px] h-[400px] rounded-[20px] bg-[#FFFFFF1A] mb-11">
      {name && image && (
        <img
          src={image}
          alt={""}
          className="w-[276px] h-[307px] rounded-[14px] object-cover"
        />
      )}
      <div className="flex justify-between w-full">
        <h4 className="font-medium text-white mb-0 capitalize">{name}</h4>
        <h4 className="nft-price text-lg font-bold  mb-0">
          {price} {symbol}
        </h4>
      </div>
      <Button className="hidden text-[19px] font-medium text-white rounded-xl w-full py-4  collect-button">
        Collect Now
      </Button>
    </div>
  );
};

export default NftCard;
