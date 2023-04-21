import Image from "next/image";
import React from "react";
import contactImage from "../../public/images/contact-us.png";
import Button from "../Button";

const Contact = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="w-[50%]">
        <Image src={contactImage} alt="marketplan" className="w-[580px] h-[663px] object-contain" />
      </div>
      <div className="w-[50%]">
        <p className="text-[56px] font-extrabold text-textLight">
          Subscribe And get Latest news update about NFTs.
        </p>
        <p className="text-textLight mt-9">
          Stay ahead of the curve with the latest NFT trends and insights. Join our newsletter for a
          curated selection of top news, market updates, and exclusive content delivered straight to
          your inbox!
        </p>
        <div className="flex gap-10 w-full mt-[60px]">
          <div className="w-[75%] bg-[#FFFFFF1A] rounded-full p-4">
            <input
              className="w-full   p-4 text-textLight"
              placeholder="Enter your email address"
              style={{ all: "unset" }}
            />
          </div>
          <Button className="" type="rounded">Subscribe</Button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
