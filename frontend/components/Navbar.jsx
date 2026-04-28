import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { menu, search, profile, logo } from "../src/assets";

import { navlinks } from "../constants";
import { CustomButton } from "./";
import { useStateContext } from "../context";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, disconnect, address, isConnected, isConnecting } =
    useStateContext();
  const walletConnected = Boolean(address && isConnected);

  const connectLabel = walletConnected
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : isConnecting
      ? "Connecting..."
      : "Connect";

  const handleConnectToggle = async () => {
    try {
      if (walletConnected) await disconnect?.();
      else await connect?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      if (!walletConnected) await connect?.();
      navigate("/create-campaign");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="flex md:flex-row
        flex-col-reverse justify-between mb-[35px]
        gap-6"
    >
      <div
        className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4
            pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]"
      >
        <input
          type="text"
          placeholder="Search for Campaign"
          className="
            flex w-full font-epilogue font-normal text-[14px]
            placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        />

        <div
          className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] 
            flex justify-center items-center cursor-pointer"
        >
          <img
            src={search}
            alt="search"
            className="w-[15px] h-[15px]
                object-contain"
          />
        </div>
      </div>
      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomButton
          btnType="button"
          title={connectLabel}
          styles={walletConnected ? "bg-[#2c2f32]" : "bg-[#8c6dfd]"}
          handleClick={handleConnectToggle}
        />
        <CustomButton
          btnType="button"
          title="Create a campaign"
          styles={walletConnected ? "bg-[#1dc071]" : "bg-[#1dc071] opacity-80"}
          handleClick={handleCreateCampaign}
        />

        <Link to="/profile">
          <div
            className="w-[52px] h-[52px] rounded-full 
                  bg-[#2c2f32] flex justify-center items-center cursor-pointer"
          >
            <img
              src={profile}
              alt="user"
              className="w-[60%]
                    h-[60%] object-contain"
            />
          </div>
        </Link>
      </div>

      {/** Small screen navigaion */}
      <div className="sm:hidden flex justify-between items-center relative">
        <Link to="/profile">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img
              src={logo}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <CustomButton
            btnType="button"
            title={connectLabel}
            styles={`${walletConnected ? "bg-[#2c2f32]" : "bg-[#8c6dfd]"} min-h-[40px] px-3 text-[14px] leading-[20px]`}
            handleClick={handleConnectToggle}
          />
          <CustomButton
            btnType="button"
            title="Create"
            styles={`${walletConnected ? "bg-[#1dc071]" : "bg-[#1dc071] opacity-80"} min-h-[40px] px-3 text-[14px] leading-[20px]`}
            handleClick={handleCreateCampaign}
          />

          <img
            src={menu}
            alt="menu"
            className="w-[34px] h-[34px] object-contain cursor-pointer"
            onClick={() => setToggleDrawer((prev) => !prev)}
          />
        </div>
        <div
          className={`absolute top-[60px] right-0
	                    left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 
	                    ${
                        !toggleDrawer ? "translate-y-[100vh]" : "translate-y-0"
                      } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain
	                    ${isActive === link.name ? "grayscale-0" : "grayscale"}`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex mx-4 gap-3">
            <CustomButton
              btnType="button"
              title={connectLabel}
              styles={walletConnected ? "bg-[#2c2f32]" : "bg-[#8c6dfd]"}
              handleClick={handleConnectToggle}
            />
            <CustomButton
              btnType="button"
              title="Create a campaign"
              styles={walletConnected ? "bg-[#1dc071]" : "bg-[#1dc071] opacity-80"}
              handleClick={handleCreateCampaign}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
