import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <div className="px-[90px]">
      <div className="flex justify-between  py-11  text-[#FFFFFF80] border-t border-gray-800">
        <p>@2023NITFEE. All rights reserved </p>
        <div className="flex gap-12">
          <p>Terms & Agreements</p>
          <p>Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
