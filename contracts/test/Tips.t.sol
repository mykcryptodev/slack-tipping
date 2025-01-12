// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Tips.sol";

contract TipsTest is Test {
    Tips public tips;
    address public admin;
    address public alice;
    address public bob;
    address public charlie;
    address public tipper;
    address public engineBackendWallet;
    bytes32 public constant ENCRYPTED_TEAM_ID = keccak256(abi.encode("SLACK_TEAM_ID"));

    function setUp() public {
        admin = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        charlie = makeAddr("charlie");
        tipper = makeAddr("tipper");
        engineBackendWallet = makeAddr("engineBackendWallet");

        // Deploy contract
        tips = new Tips(admin, "Tips Token", "TIP", engineBackendWallet);

        // Give tipper the TIP_ON_BEHALF_OF_ROLE
        tips.grantRole(tips.TIP_ON_BEHALF_OF_ROLE(), tipper);
    }

    function testInitialState() view public {
        assertEq(tips.name(), "Tips Token");
        assertEq(tips.symbol(), "TIP");
        assertTrue(tips.hasRole(tips.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(tips.hasRole(tips.REGISTER_ROLE(), admin));
        assertTrue(tips.hasRole(tips.TIP_ON_BEHALF_OF_ROLE(), tipper));
        // Check engine backend wallet roles
        assertTrue(tips.hasRole(tips.REGISTER_ROLE(), engineBackendWallet));
        assertTrue(tips.hasRole(tips.TIP_ON_BEHALF_OF_ROLE(), engineBackendWallet));
    }

    function testRegistration() public {
        // Test registration
        tips.registerAccount(alice);
        assertTrue(tips.isRegistered(alice));

        // Test unregistration
        tips.unregisterAccount(alice);
        assertFalse(tips.isRegistered(alice));
    }

    function testRegistrationOnlyRegisterRole() public {
        // Try to register from non-authorized account
        vm.prank(alice);
        vm.expectRevert();
        tips.registerAccount(bob);
    }

    function testTipping() public {
        // Register sender account
        tips.registerAccount(alice);

        // Test successful tip to unregistered recipient
        vm.prank(alice);
        tips.tip(bob, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);
        assertEq(tips.balanceOf(bob), 1 * 10**18);
    }

    function testTipUnregisteredSender() public {
        // Should still fail when a non-TIP_ON_BEHALF_OF_ROLE tries to tip from unregistered account
        vm.prank(alice);
        vm.expectRevert(SenderNotRegistered.selector);
        tips.tip(bob, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);
    }

    function testTipToSelf() public {
        tips.registerAccount(alice);
        
        vm.prank(alice);
        vm.expectRevert(CannotTipYourself.selector);
        tips.tip(alice, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);
    }

    function testDailyTipLimit() public {
        tips.registerAccount(alice);

        // Send max daily limit
        vm.prank(alice);
        tips.tip(bob, alice, 5 * 10**18, ENCRYPTED_TEAM_ID);

        // Try to send more
        vm.prank(alice);
        vm.expectRevert(DailyTipLimitExceeded.selector);
        tips.tip(bob, alice, 1, ENCRYPTED_TEAM_ID);
    }

    function testTipLimitReset() public {
        tips.registerAccount(alice);

        // Send max daily limit
        vm.prank(alice);
        tips.tip(bob, alice, 5 * 10**18, ENCRYPTED_TEAM_ID);

        // Move forward 24 hours
        vm.warp(block.timestamp + 24 hours);

        // Should be able to tip again
        vm.prank(alice);
        tips.tip(bob, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);
        assertEq(tips.balanceOf(bob), 6 * 10**18);
    }

    function testTipOnBehalfOf() public {
        tips.registerAccount(alice);

        // Tipper (with TIP_ON_BEHALF_OF_ROLE) tips on behalf of alice
        vm.prank(tipper);
        tips.tip(bob, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);
        assertEq(tips.balanceOf(bob), 1 * 10**18);
    }

    function testUnauthorizedTipOnBehalfOf() public {
        tips.registerAccount(alice);

        // Charlie (without TIP_ON_BEHALF_OF_ROLE) tries to tip on behalf of alice
        vm.prank(charlie);
        vm.expectRevert(SenderNotAuthorized.selector);
        tips.tip(bob, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);
    }

    function testTipManySuccess() public {
        tips.registerAccount(alice);
        
        address[] memory recipients = new address[](2);
        recipients[0] = bob;
        recipients[1] = charlie;

        // Test successful tips to multiple recipients
        vm.prank(alice);
        tips.tipMany(recipients, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);

        assertEq(tips.balanceOf(bob), 1 * 10**18);
        assertEq(tips.balanceOf(charlie), 1 * 10**18);
        assertEq(tips.tipsSentToday(alice), 2 * 10**18);
    }

    function testTipManyDailyLimit() public {
        tips.registerAccount(alice);
        
        address[] memory recipients = new address[](3);
        recipients[0] = bob;
        recipients[1] = charlie;
        recipients[2] = tipper;

        // Try to tip 2 tokens each to 3 recipients (6 total, exceeding 5 token daily limit)
        vm.prank(alice);
        vm.expectRevert(DailyTipLimitExceeded.selector);
        tips.tipMany(recipients, alice, 2 * 10**18, ENCRYPTED_TEAM_ID);
    }

    function testTipManyUnregisteredSender() public {
        address[] memory recipients = new address[](2);
        recipients[0] = bob;
        recipients[1] = charlie;

        // Should fail when a non-TIP_ON_BEHALF_OF_ROLE tries to tip from unregistered account
        vm.prank(alice);
        vm.expectRevert(SenderNotRegistered.selector);
        tips.tipMany(recipients, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);
    }

    function testTipManyOnBehalfOf() public {
        tips.registerAccount(alice);
        
        address[] memory recipients = new address[](2);
        recipients[0] = bob;
        recipients[1] = charlie;

        // Tipper (with TIP_ON_BEHALF_OF_ROLE) tips on behalf of alice to multiple recipients
        vm.prank(tipper);
        tips.tipMany(recipients, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);

        assertEq(tips.balanceOf(bob), 1 * 10**18);
        assertEq(tips.balanceOf(charlie), 1 * 10**18);
    }

    function testExternalTipStillWorks() public {
        tips.registerAccount(alice);

        // Test that the external tip function still works as before
        vm.prank(alice);
        tips.tip(bob, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);
        assertEq(tips.balanceOf(bob), 1 * 10**18);
        assertEq(tips.tipsSentToday(alice), 1 * 10**18);
    }

    function testTipOnBehalfOfUnregisteredSender() public {
        // Tipper (with TIP_ON_BEHALF_OF_ROLE) should be able to tip on behalf of unregistered account
        vm.prank(tipper);
        tips.tip(bob, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);
        assertEq(tips.balanceOf(bob), 1 * 10**18);
    }

    function testTipManyOnBehalfOfUnregisteredSender() public {
        address[] memory recipients = new address[](2);
        recipients[0] = bob;
        recipients[1] = charlie;

        // Tipper (with TIP_ON_BEHALF_OF_ROLE) should be able to tip on behalf of unregistered account
        vm.prank(tipper);
        tips.tipMany(recipients, alice, 1 * 10**18, ENCRYPTED_TEAM_ID);

        assertEq(tips.balanceOf(bob), 1 * 10**18);
        assertEq(tips.balanceOf(charlie), 1 * 10**18);
    }
}
