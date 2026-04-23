import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logo, sun } from "../src/assets";
import { navlinks } from "../constants";

const Icon = ({ styles, name, imageUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] 
        ${isActive && isActive == name && "bg-[#2c2f32]"} ${!disabled && "cursor-pointer"} 
         ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      <img
        src={imageUrl}
        alt="fund_logo"
        className="w-1/2 h-1/2 object-contain"
      />
    ) : (
      <img
        src={imageUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 object-contain 
                ${isActive !== name && "grayscale"}`}
      />
    )}{" "}
  </div>
);

const Sidebar = () => {
  const [isActive, setIsActive] = useState("dashboard");
  return (
    <div
      className="flex justify-between items-center flex-col sticky top-5 
        h-[93vh]"
    >
      <Link to="/" className="flex items-center justify-center">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>
    </div>
  );
};

export default Sidebar;
