# Crowdfunding dApp

A full-stack decentralized crowdfunding application built with Foundry, Solidity, and React + Vite.

The project includes:

- A Solidity smart contract (`src/Crowdfunding.sol`) for campaign creation, donations, and campaign retrieval.
- A React front-end in `frontend/` that connects to the smart contract with Wagmi, Viem, and Ethers.
- Foundry tooling for compile, test, and deploy.
- A deployment script in `script/Deploy.s.sol`.

---

## Project Overview

This dApp allows users to:

- Create a fundraising campaign with title, description, goal, deadline, and image.
- Donate ETH to any campaign.
- View campaigns and see donation history.
- Read campaign details including owner, raised amount, deadline, and backers.

The front-end is a user interface for interacting with the deployed `Crowdfunding` contract.

---

## Smart Contract

The contract is implemented in `src/Crowdfunding.sol` and provides the following core features:

- `createCampaign(address _owner, string _title, string _description, uint256 _target, uint256 _deadline, string _image)`: creates a new campaign and stores it in a mapping.
- `donateToCampaign(uint256 _id) payable`: allows visitors to send ETH to a campaign, records the donator and amount, and transfers the funds immediately to the campaign owner.
- `getDonators(uint256 _id) view returns (address[] memory, uint256[] memory)`: returns the list of donators and donation amounts for a campaign.
- `getCampaigns() public view returns (Campaign[] memory)`: returns every campaign in the contract.
- `getCampaign(uint256 _id) public view returns (Campaign memory)`: returns a single campaign by ID.

Key contract data structure:

- `Campaign`: stores the owner, title, description, target amount, deadline, amount raised, image URL, donators, and donations.

---

## Frontend Architecture

The UI is located in `frontend/` and uses:

- React 19
- Vite
- Tailwind CSS
- Wagmi + Viem for wallet and contract interaction
- Ethers for formatting and parsing ETH values

Important front-end modules:

- `frontend/context/index.jsx`: state provider with functions for wallet connect, creating campaigns, donating, and reading contract data.
- `frontend/constants/crowdfundingAbi.js`: ABI used by the front-end to call the contract.
- `frontend/pages/Home.jsx`: lists all campaigns.
- `frontend/pages/CreateCampaign.jsx`: form for launching new campaigns.
- `frontend/pages/CampaignDetails.jsx`: shows campaign details and donation UI.
- `frontend/pages/Profile.jsx`: displays campaign listings and can be extended for user-specific content.

---

## Requirements

- Node.js 18+ or later
- npm or yarn
- Foundry (`forge`, `anvil`, `cast`)
- MetaMask or another injected Ethereum wallet

---

## Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd Crowdfunding-dApp
```

2. Install front-end dependencies:

```bash
cd frontend
npm install
```

3. Install Foundry if not installed already:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

---

## Running Locally

### Smart contract build and test

From the project root:

```bash
forge build
forge test
```

### Launch local chain

```bash
anvil
```

### Deploy to a local chain

In another terminal:

```bash
forge script script/Deploy.s.sol:DeployScript --fork-url http://127.0.0.1:8545 --broadcast
```

### Deploy to Sepolia / testnet

Set your Sepolia RPC endpoint and wallet private key in environment variables. Example:

```bash
export SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/<your-infura-api-key>"
export PRIVATE_KEY="0xyourwalletprivatekey"
```

Then deploy with Foundry:

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url "$SEPOLIA_RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --broadcast
```

After the script completes, copy the deployed contract address from the deployment output or from the generated `broadcast/Deploy.s.sol/<chain-id>/run-latest.json` file.

### Run the React app

From `frontend/`:

```bash
npm run dev
```

Open the app in your browser at the URL shown by Vite.

---

## Environment Configuration

The front-end reads the contract address from `VITE_CROWDFUNDING_ADDRESS`.

Create a `.env` file inside `frontend/` if you want to override the default value:

```text
VITE_CROWDFUNDING_ADDRESS=0xYourDeployedContractAddress
```

If this variable is not set, the app uses a fallback address defined in `frontend/context/index.jsx`.

---

## Usage

- Connect your wallet with MetaMask.
- Create a campaign by entering a title, description, goal, deadline, and image URL.
- Browse the campaign list on the home screen.
- Click on a campaign to view details, read the story, and donate.

---

## Notes

- Donations are forwarded immediately from the contract to the campaign owner.
- Campaign deadlines are validated in Solidity to ensure they are in the future.
- The front-end converts ETH values using `ethers.parseEther` and `ethers.formatEther`.

---

## File structure highlights

- `src/Crowdfunding.sol` — smart contract
- `script/Deploy.s.sol` — Foundry deploy script
- `frontend/src/App.jsx` — main React routes
- `frontend/context/index.jsx` — contract interaction logic
- `frontend/constants/crowdfundingAbi.js` — contract ABI

---

## Future Improvements

- Add campaign owner filtering for the profile page.
- Add verification or campaign approval flow.
- Store campaign status and enable goal completion logic.
- Add persistent backend or IPFS support for campaign images and metadata.
