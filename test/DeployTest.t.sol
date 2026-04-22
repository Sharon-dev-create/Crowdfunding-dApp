// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {Script} from "forge-std/Script.sol";
import {Crowdfunding} from "../src/Crowdfunding.sol";

contract DeployTest is Test, Script {
    function testDeployScript() public {
        // Use a dummy private key for testing
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

        vm.startBroadcast(deployerPrivateKey);

        Crowdfunding crowdfunding = new Crowdfunding();

        vm.stopBroadcast();

        // Verify the contract was deployed
        assertTrue(address(crowdfunding) != address(0));

        // Verify initial state
        assertEq(crowdfunding.numberOfCampaigns(), 0);

        // Test that the contract functions work after deployment
        address owner = address(0x123);
        string memory title = "Test Campaign";
        string memory description = "A test campaign";
        uint256 target = 1 ether;
        uint256 deadline = block.timestamp + 1 days;
        string memory image = "test.jpg";

        uint256 campaignId = crowdfunding.createCampaign(owner, title, description, target, deadline, image);

        assertEq(campaignId, 0);
        assertEq(crowdfunding.numberOfCampaigns(), 1);

        // Verify the campaign details
        (address campaignOwner, string memory campaignTitle, string memory campaignDescription, uint256 campaignTarget, uint256 campaignDeadline, uint256 amountCollected, string memory campaignImage) = crowdfunding.campaigns(campaignId);
        assertEq(campaignOwner, owner);
        assertEq(campaignTitle, title);
        assertEq(campaignTarget, target);
        assertEq(campaignDeadline, deadline);
        assertEq(amountCollected, 0);
        assertEq(campaignImage, image);
    }
}