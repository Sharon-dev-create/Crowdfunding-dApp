import React, { useContext, createContext } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { parseAbi } from "viem";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { address } = useAccount();
    
    // ABI fragment for createCampaign function
    const abi = parseAbi([
        "function createCampaign(address _owner, string _description, uint256 _target, uint256 _deadline, string _image) returns (uint256)"
    ]);
    const { writeContractAsync: createCampaignWrite } = useWriteContract();

    const publishCampaign = async (form) => {
        try {
            const data = await createCampaignWrite({
                address: "0x429b3B235FA8e532ed033AE9f50e62b05413F3c7",
                abi,
                functionName: "createCampaign",
                args: [
                    address, //owner
                    form.description, //description
                    ethers.parseEther(form.target || "0"),
                    Math.floor(new Date(form.deadline).getTime() / 1000),
                    form.image
                ]
            })
            console.log("contract call success", data)
        }
        catch (error) {
            console.log("contract call failure", error)
        }
    }

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                createCampaign: publishCampaign
            }}
            >
            {children}
            </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);  
