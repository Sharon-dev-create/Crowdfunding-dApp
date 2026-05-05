import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useStateContext } from "../context";
import { CountBox } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { profile } from "../assets";
import { CustomButton } from "../components";

const CampaignDetails = () => {
  const params = useParams();
  const { state } = useLocation();
  const { donate, getDonations, getCampaign } = useStateContext();
  const campaignId = state?.pId ?? params?.id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const [campaign, setCampaign] = useState(state ?? null);

  const remainingDays = campaign?.deadline ? daysLeft(campaign.deadline) : 0;

  const fetchCampaign = async () => {
    if (campaignId === undefined || campaignId === null) return;
    const latest = await getCampaign(campaignId);
    setCampaign(latest);
  };

  const fetchDonators = async () => {
    if (campaignId === undefined || campaignId === null) return;
    const data = await getDonations(campaignId);
    setDonators(data);
  };
  
  useEffect(() => {
    fetchCampaign().catch((err) => console.error(err));
    fetchDonators().catch((err) => console.error(err));
  }, [campaignId, getCampaign, getDonations]);
  
  const handleDonate = async () => {
    if (campaignId === undefined || campaignId === null) return;
    if (!amount || Number(amount) <= 0) {
      alert("Enter an amount greater than 0.");
      return;
    }

    try {
      setIsLoading(true);
      await donate(campaignId, amount);
      setAmount("");
      await Promise.all([fetchCampaign(), fetchDonators()]);
    } catch (err) {
      console.error(err);
      alert(err?.shortMessage ?? err?.message ?? "Failed to donate.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaign) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      {isLoading && "Loading..."}
      <div
        className="w-full flex md:flex-row flex-col mt-10 gap-[30px]"
      >
        <div className="flex-1 flex flex-col">
          <img
            src={campaign.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div
            className="relative w-full h-[5px] bg-[#3a3a43] mt-2"
          >
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${calculateBarPercentage(
                  campaign.target,
                  campaign.amountCollected,
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>
        <div
          className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]"
        >
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox
            title={`Raised of ${campaign.target}`}
            value={campaign.amountCollected}
          />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>
      <div
        className="mt-[60px] flex flex-col lg:flex-row gap-5"
      >
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4
              className="font-epilogue font-semibold text-[18px] text-white p-3 uppercase"
            >
              Creator
            </h4>

            <div
              className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]"
            >
              <div
                className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer"
              >
                <img
                  src={profile}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4
                className="font-epilogue font-semibold text-[14px] text-white break-all"
                >
                  {campaign.owner}
                </h4>
                <p
                  className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]"
                >
                  {" "}
                  10 Campaigns
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4
            className="font-epilogue font-semibold text-[18px] text-white p-3 uppercase"
          >
            Story
          </h4>
          <div className="mt-[20px]">
            <p
              className="mt-[4px] font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify"
            >
              {campaign.description}
            </p>
          </div>
        </div>

        <div>
          <h4
            className="font-epilogue font-semibold text-[18px] text-white p-3 uppercase"
          >
            Donators
          </h4>
          <div className="mt-[20px] flex flex-col gap-4">
            {donators.length > 0 ? donators.map((item, index) => (
              <div>
                DONATOR
                </div>
            )) : (
              <p className="font-epilogue font-normal text-[16px] text-[#808191]">
                No donators yet. Be the first one!
              </p>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white 
           uppercase">
            Fund
          </h4>
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px]
            text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input type="number"
               placeholder="ETH 0.1"
              step="0.01"
              className="w-full py-[10px] sm:px-[20px] px-[15px]
              outline-none border-[1px] border-[#3a3a43]
              bg-transparent font-epilogue text-white text-[18px]
              leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]
              ">
                <h4 className="font-epilogue font-semibold text-[14px]
                leading-[22px] text-white">
                  Back it because you believe in it.
                </h4>
                <p className="mt-[20px] font-epilogue font-normal
                 leading-[22px] text-[#808191]">
                  Support the project for no reward, just becaue it speaks to you.
                </p>
              </div>

              <CustomButton
              btnType="button"
              title="Fund Campaign"
              styles="w-full bg-[#8c6dfd]"
              handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
