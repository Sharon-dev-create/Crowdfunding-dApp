export const crowdfundingAbi = [
  {
    type: "function",
    name: "createCampaign",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_title", type: "string" },
      { name: "_description", type: "string" },
      { name: "_target", type: "uint256" },
      { name: "_deadline", type: "uint256" },
      { name: "_image", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getCampaigns",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "owner", type: "address" },
          { name: "title", type: "string" },
          { name: "description", type: "string" },
          { name: "target", type: "uint256" },
          { name: "deadline", type: "uint256" },
          { name: "amountCollected", type: "uint256" },
          { name: "image", type: "string" },
          { name: "donators", type: "address[]" },
          { name: "donations", type: "uint256[]" },
        ],
      },
    ],
  },
];

