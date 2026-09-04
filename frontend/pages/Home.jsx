import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';

import { CustomButton, DisplayCampaigns } from '../components'; 
import { useStateContext } from '../context';
import { createCampaign } from '../src/assets';

const Home = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    const { getCampaigns, connect, isConnecting, address, isConnected } = useStateContext();
    const walletConnected = Boolean(address && isConnected);

    const handleCreateCampaign = async () => {
      try {
        if (!walletConnected) await connect?.();
        navigate('/create-campaign');
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCampaigns = useCallback(async () => {
      setIsLoading(true);
      try {
        const data = await getCampaigns();
        setCampaigns(data);
      } finally {
        setIsLoading(false);
      }
    }, [getCampaigns]);

    useEffect(() => {
      fetchCampaigns().catch((err) => console.error(err));
    }, [fetchCampaigns]);

    return (
      <>
        {!walletConnected && (
          <section className="mb-[40px] rounded-[16px] bg-[#1c1c24] border border-[#3a3a43] p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-[620px]">
                <div className="flex items-center gap-3 mb-4">
                  <img src={createCampaign} alt="" className="w-7 h-7 object-contain" />
                  <span className="font-epilogue font-semibold text-[13px] uppercase tracking-[2px] text-[#4acd8d]">
                    Make an impact
                  </span>
                </div>
                <h1 className="font-epilogue font-bold text-[30px] sm:text-[42px] leading-[1.1] text-white">
                  Bring your next idea to life.
                </h1>
                <p className="mt-4 font-epilogue text-[16px] leading-[26px] text-[#b7b7c3]">
                  Connect your wallet to launch a campaign and give your community something worth backing.
                </p>
              </div>
              <CustomButton
                btnType="button"
                title={isConnecting ? 'Connecting...' : 'Connect wallet to create a campaign'}
                styles="w-full lg:w-auto bg-[#1dc071] px-7 text-[17px] hover:bg-[#4acd8d] transition-colors"
                handleClick={handleCreateCampaign}
              />
            </div>
          </section>
        )}
        <DisplayCampaigns
          title="All Campaigns"
          isLoading={isLoading}
          campaigns={campaigns}
        />
      </>
    )
}

export default Home
