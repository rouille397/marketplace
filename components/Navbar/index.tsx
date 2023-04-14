import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAVBAR } from "../../constants";
import Button from "../Button";
import logo from "../../public/images/logo.png";
import discord from "../../public/images/discord.svg";
import wallet from "../../public/images/wallet.svg";

const Navbar: FC = () => {
  return (
    <div className="flex justify-between items-center px-[78px]">
      <div className="flex items-center gap-2">
        <Image src={logo} alt="NITFEE" className="w-[72px] h-[70px] object-contain" />
        <h1 className="text-white text-[32px] font-bold uppercase">NITFEE</h1>
      </div>
      <div className="flex gap-9">
        {NAVBAR?.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            className="text-base font-bold text-white uppercase"
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="flex gap-5">
        <Button className="uppercase font-bold text-base text-white flex gap-2 items-center px-6 py-3 rounded-xl bg-[#141B22]">
          <Image src={discord} alt="marketplan nitfee discord" className="w-6 h-4 object-contain" />
          Discord
        </Button>
        <Button className="uppercase font-bold text-base text-white flex gap-2 items-center px-6 py-3 rounded-xl walletConnectButton">
          <Image src={wallet} alt="marketplan nitfee discord" className="w-6 h-4 object-contain" />
          connect
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
