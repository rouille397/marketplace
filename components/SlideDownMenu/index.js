import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./slideDownMenu.module.css";
import { useRouter } from "next/router";
import logo from "../../public/images/logo.png";
import Footer from "../Footer";

const SlideDownMenu = ({ menu, callback }) => {
  const { route } = useRouter();
  return (
    <div className={`${styles.menu} bg-night`}>
      <div className={styles.crossIcon}>
        <div>
          <Image src={logo} alt="marketplan" height={40} width={40} />
        </div>
        <span onClick={() => callback && callback(false)} className="text-walletConnectButton text-3xl">x</span>
      </div>
      <div className="flex-1 flex flex-col">
        {menu?.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            onClick={() => callback && callback(false)}
            className={`${styles.menuLink} ${route == item.link ? "nft-price" : "text-gradient-secondary"} `}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default SlideDownMenu;
