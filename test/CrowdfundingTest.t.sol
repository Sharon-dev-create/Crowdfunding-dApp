//SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {Crowdfunding} from "src/Crowdfunding.sol";
import {DeployScript} from "script/Deploy.s.sol";

contract CrowdfundingTest is Test{
    Crowdfunding crowdfunding;
    ERC20Mock token;

    receive() external payable {}

    function setUp() public {
        crowdfunding = new Crowdfunding();
        token = new ERC20Mock();
        token.mint(address(this), 1000);
    }

    function testCreateCampaign() public {
        uint256 deadline = block.timestamp + 1 days;

        // Create a campaign
        uint256 campaignId = crowdfunding.createCampaign(
            address(this),
            "Test Campaign",
            "This is a test campaign",
            1000,
            deadline,
            "https://example.com/image.jpg"
        );

        // Verify campaign details
        Crowdfunding.Campaign memory c = crowdfunding.getCampaign(campaignId);

        assertEq(c.owner, address(this));
        assertEq(c.title, "Test Campaign");
        assertEq(c.description, "This is a test campaign");   
        assertEq(c.target, 1000);
        assertEq(c.deadline, deadline);
        assertEq(c.amountCollected, 0);
        assertEq(c.image, "https://example.com/image.jpg");  

    }

    function testDonateToCampaign() public {
        uint256 deadline = block.timestamp + 1 days;

        // Create a campaign
        uint256 campaignId = crowdfunding.createCampaign(
            address(this),
            "Test Campaign",
            "This is a test campaign",
            1000,
            deadline,
            "https://example.com/image.jpg"
        );

        // Donate to the campaign
        crowdfunding.donateToCampaign{value: 500}(campaignId);

        // Verify donation details
        Crowdfunding.Campaign memory cam = crowdfunding.getCampaign(campaignId);

        assertEq(cam.amountCollected, 500);
        assertEq(cam.donators.length, 1);
        assertEq(cam.donators[0], address(this));
        assertEq(cam.donations.length, 1);
        assertEq(cam.donations[0], 500);
    }

    function testDonateToNonExistentCampaign() public {
        // Attempt to donate to a non-existent campaign
        vm.expectRevert();
        crowdfunding.donateToCampaign{value: 500}(999);
    }

    function testCreateCampaignWithPastDeadline() public {
        uint256 pastDeadline = block.timestamp - 1;

        // Attempt to create a campaign with a past deadline
        vm.expectRevert();
        crowdfunding.createCampaign(
            address(this),
            "Invalid Campaign",
            "This campaign has a past deadline",
            1000,
            pastDeadline,
            "https://example.com/image.jpg"
        );
    }

    function testGetAllCampaigns() public {
        uint256 deadline = block.timestamp + 1 days;

        // Create multiple campaigns
        crowdfunding.createCampaign(
            address(this),
            "Campaign 1",
            "Description 1",
            1000,
            deadline,
            "https://example.com/image1.jpg"
        );

        crowdfunding.createCampaign(
            address(this),
            "Campaign 2",
            "Description 2",
            2000,
            deadline,
            "https://example.com/image2.jpg"
        );

        // Get all campaigns
        Crowdfunding.Campaign[] memory allCampaigns = crowdfunding.getCampaigns();

        // Verify the number of campaigns
        assertEq(allCampaigns.length, 2);

        // Verify details of the first campaign
        assertEq(allCampaigns[0].title, "Campaign 1");
        assertEq(allCampaigns[0].description, "Description 1");
        assertEq(allCampaigns[0].target, 1000);
        assertEq(allCampaigns[0].deadline, deadline);
        assertEq(allCampaigns[0].image, "https://example.com/image1.jpg");

        // Verify details of the second campaign
        assertEq(allCampaigns[1].title, "Campaign 2");
        assertEq(allCampaigns[1].description, "Description 2");
        assertEq(allCampaigns[1].target, 2000);
        assertEq(allCampaigns[1].deadline, deadline);
        assertEq(allCampaigns[1].image, "https://example.com/image2.jpg");
    }

    function testGetDonators() public {
        uint256 deadline = block.timestamp + 1 days;

        // Create a campaign
        uint256 campaignId = crowdfunding.createCampaign(
            address(this),
            "Test Campaign",
            "This is a test campaign",
            1000,
            deadline,
            "https://example.com/image.jpg"
        );

        // Donate to the campaign
        crowdfunding.donateToCampaign{value: 500}(campaignId);

        // Get donators and donations
        (address[] memory donators, uint256[] memory donations) = crowdfunding.getDonators(campaignId);

        // Verify donators and donations
        assertEq(donators.length, 1);
        assertEq(donators[0], address(this));
        assertEq(donations.length, 1);
        assertEq(donations[0], 500);
    }
}