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
    }
}