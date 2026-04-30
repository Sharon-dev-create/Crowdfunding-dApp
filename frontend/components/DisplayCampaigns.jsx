import React from 'react';
import { useNavigate } from 'react-router-dom';

import { loader } from '../assets';
import { useStateContext } from '../context';

const displayCampaign = ({ title, isLoading, campaigns }) => {
        return (
            <div>
                <h1>{title}</h1>
                {isLoading ? (
                    <img src={loader} alt="Loading..." />
                ) : (
                    <div>
                        {campaigns.map((campaign) => (
                            <div key={campaign.id}>
                                <h3>{campaign.name}</h3>
                                <p>{campaign.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
}

export default displayCampaign;