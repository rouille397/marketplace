import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import { NAVBAR } from "../../constants";
import Button from "../Button";
import logo from "../../public/images/logo.png";
import discord from "../../public/images/discord.svg";
import wallet from "../../public/images/wallet.svg";

const Navbar: FC = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();

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
        {address && (
          <p className="font-medium text-white px-6 py-3 rounded-xl border border-[#141B22] min-w-[154px]">
            {address?.slice(0, 6).concat("...").concat(address?.slice(-4))}
          </p>
        )}
        <Button
          className="uppercase font-bold text-base text-white flex gap-2 items-center px-6 py-3 rounded-xl walletConnectButton"
          onClick={() => {
            address ? disconnect() : connectWithMetamask();
          }}
        >
          <Image src={wallet} alt="marketplan nitfee discord" className="w-6 h-4 object-contain" />
          {address ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
