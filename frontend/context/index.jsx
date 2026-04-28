import React, { useContext, createContext } from "react";
import { useAccount, useConnect, useDisconnect, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { parseAbi } from "viem";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const { connectAsync, connectors, isPending: isConnecting } = useConnect();
    const { disconnectAsync } = useDisconnect();
    
    // ABI fragment for createCampaign function
    const abi = parseAbi([
        "function createCampaign(address _owner, string _description, uint256 _target, uint256 _deadline, string _image) returns (uint256)"
    ]);
    const { writeContractAsync: createCampaignWrite } = useWriteContract();

    const connect = async () => {
        const injectedConnector =
            connectors?.find((connector) => connector?.id === "injected") ??
            connectors?.[0];

        if (!injectedConnector) {
            throw new Error("No wallet connector configured.");
        }

        await connectAsync({ connector: injectedConnector });
    };

    const disconnect = async () => {
        await disconnectAsync();
    };

    const publishCampaign = async (form) => {
        try {
            if (!address) throw new Error("Wallet not connected.");

            const data = await createCampaignWrite({
                address: "0x429b3B235FA8e532ed033AE9f50e62b05413F3c7",
                abi,
                functionName: "createCampaign",
                args: [
                    address, //owner
                    form.description, //description
                    ethers.parseEther(form.target || "0"),
                    Math.floor(new Date(form.deadline).getTime() / 1000),
                    form.image,
                ],
            });
            console.log("contract call success", data);
        } catch (error) {
            console.log("contract call failure", error);
        }
    };

    const getCampaigns = async () => {
        const campaigns = await contract.call 
        ('getCampaigns');

        // console.log(campaigns);
        const parsedCampaigns = campaigns.map((campaign) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected:ethers.utilsformatEther(amountCollected.toString()),
            image: campaign.image,
            pId: i
        }))
    }

    return (
        <StateContext.Provider
            value={{
                address,
                isConnected,
                isConnecting,
                connect,
                disconnect,
                createCampaign: publishCampaign,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
