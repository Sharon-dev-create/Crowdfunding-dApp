import React, { useState, useEffect, useCallback } from 'react'

import { DisplayCampaigns } from '../components'; 
import { useStateContext } from '../context';

const Profile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    const { getCampaigns } = useStateContext();

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
        <DisplayCampaigns
            title="All Campaigns"
            isLoading={isLoading}
            campaigns={campaigns}
        />
    )
}

export default Profile
