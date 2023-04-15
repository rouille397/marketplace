import Image from "next/image";
import React from "react";
import handImage from "../../public/images/hand-image.png";

const Header = () => {
  return (
    <div className="bg-[url('/images/header-bg-img.png')] bg-cover  min-[1440px]:bg-cover bg-top bg-no-repeat  w-full h-screen xl:h-screen flex justify-center items-end relative">
      <Image src={handImage} alt="nitee conflux espace" className="relative z-[1]" />
      <h1 className="nitfee-text uppercase text-[200px] font-bold absolute top-[18%] ">NITFEE</h1>
      <h1 className="conflux-text text-[180px] font-bold absolute z-[2] top-[45%]">
        Conflux Espace
      </h1>
      <div className="absolute z-[2] top-[75%] flex justify-center">
        <h2 className="font-semibold text-[27px] text-white w-[1026px]">
          Explore rare and valuable digital assets on our NFT marketplace. Buy, sell, and earn
          rewards with low fees and an easy-to-use platform. Join our community of NFT enthusiasts
          today.
        </h2>
      </div>
    </div>
  );
};

export default Header;
