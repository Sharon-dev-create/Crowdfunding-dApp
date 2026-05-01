import React, { useCallback, useContext, createContext, useMemo } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { ethers } from "ethers";
import { crowdfundingAbi } from "../constants/crowdfundingAbi";

const StateContext = createContext();

const normalizeEtherAmount = (value) => {
  if (value === undefined || value === null) return "0";
  if (typeof value === "number") return String(value);

  const raw = String(value).trim();
  if (!raw) return "0";

  const withoutCommas = raw.replace(/,/g, "");
  let stripped = withoutCommas
    .replace(/^\s*(eth|Ξ)\s*/i, "")
    .replace(/\s*(eth|Ξ)\s*$/i, "")
    .trim();

  if (stripped.startsWith(".")) stripped = `0${stripped}`;

  if (/^(?:\d+|\d*\.\d+)$/.test(stripped)) return stripped;

  throw new Error('Invalid ETH amount. Enter a number like "0.5".');
};

export const StateContextProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const publicClient = usePublicClient();
  const { writeContractAsync: createCampaignWrite } = useWriteContract();

  const contractAddress =
    import.meta.env?.VITE_CROWDFUNDING_ADDRESS ??
    "0x947f36ad764d94d0cc45263b902e58449e16d2ef";

  const connect = useCallback(async () => {
    const injectedConnector =
      connectors?.find((connector) => connector?.id === "injected") ??
      connectors?.[0];

    if (!injectedConnector) throw new Error("No wallet connector configured.");

    await connectAsync({ connector: injectedConnector });
  }, [connectAsync, connectors]);

  const disconnect = useCallback(async () => {
    await disconnectAsync();
  }, [disconnectAsync]);

  const createCampaign = useCallback(
    async (form) => {
      if (!address) throw new Error("Wallet not connected.");
      if (!publicClient) throw new Error("RPC client not ready.");

      if (
        typeof contractAddress === "string" &&
        contractAddress.toLowerCase() === address.toLowerCase()
      ) {
        throw new Error(
          "Contract address is misconfigured (it points to your wallet address). Set VITE_CROWDFUNDING_ADDRESS to the deployed Crowdfunding contract address and restart the dev server.",
        );
      }

      try {
        const bytecode = await publicClient.getBytecode({
          address: contractAddress,
        });
        if (!bytecode || bytecode === "0x") {
          throw new Error(
            `No contract is deployed at ${contractAddress} on the connected network. Make sure you're on Sepolia and that VITE_CROWDFUNDING_ADDRESS matches your deployment.`,
          );
        }
      } catch (err) {
        const message = err?.shortMessage ?? err?.message ?? String(err);
        throw new Error(`Contract not reachable: ${message}`);
      }

      const deadlineSeconds = BigInt(
        Math.floor(new Date(form.deadline).getTime() / 1000),
      );
      let targetWei;
      try {
        targetWei = ethers.parseEther(normalizeEtherAmount(form.target));
      } catch (err) {
        const message = err?.shortMessage ?? err?.message ?? String(err);
        throw new Error(`Invalid goal amount: ${message}`);
      }

      const hash = await createCampaignWrite({
        address: contractAddress,
        abi: crowdfundingAbi,
        functionName: "createCampaign",
        args: [
          address,
          form.title ?? "",
          form.description ?? "",
          targetWei,
          deadlineSeconds,
          form.image ?? "",
        ],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      return hash;
    },
    [address, contractAddress, createCampaignWrite, publicClient],
  );

  const getCampaigns = useCallback(async () => {
    if (!publicClient) throw new Error("RPC client not ready.");

    const campaigns = await publicClient.readContract({
      address: contractAddress,
      abi: crowdfundingAbi,
      functionName: "getCampaigns",
    });

    return campaigns.map((campaign, i) => {
      const owner = campaign.owner ?? campaign?.[0];
      const title = campaign.title ?? campaign?.[1];
      const description = campaign.description ?? campaign?.[2];
      const target = campaign.target ?? campaign?.[3];
      const deadline = campaign.deadline ?? campaign?.[4];
      const amountCollected = campaign.amountCollected ?? campaign?.[5];
      const image = campaign.image ?? campaign?.[6];

      return {
        owner,
        title,
        description,
        target: ethers.formatEther(target),
        deadline: Number(deadline),
        amountCollected: ethers.formatEther(amountCollected),
        image,
        pId: i,
      };
    });
  }, [contractAddress, publicClient]);

  const value = useMemo(
    () => ({
      address,
      isConnected,
      isConnecting,
      connect,
      disconnect,
      contractAddress,
      createCampaign,
      getCampaigns,
    }),
    [
      address,
      connect,
      contractAddress,
      createCampaign,
      disconnect,
      getCampaigns,
      isConnected,
      isConnecting,
    ],
  );

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
