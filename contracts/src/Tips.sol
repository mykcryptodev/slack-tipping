// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";
import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";

error SenderNotRegistered();
error RecipientNotRegistered();
error CannotTipYourself();
error SenderNotAuthorized();
error DailyTipLimitExceeded();

contract Tips is ERC20Base, PermissionsEnumerable {
    bytes32 public constant REGISTER_ROLE = keccak256("REGISTER_ROLE");
    bytes32 public constant TIP_ON_BEHALF_OF_ROLE = keccak256("TIP_ON_BEHALF_OF_ROLE");

    mapping(address => bool) public isRegistered; // Tracks if an account is registered
    mapping(address => uint256) public lastTipReset; // Tracks when each account's tip limit was last reset
    mapping(address => uint256) public tipsSentToday; // Tracks the amount of tips sent today for each account
    
    uint256 public constant DAILY_TIP_LIMIT = 5 * 10**18; // 5 tokens with 18 decimals
    uint256 public constant RESET_PERIOD = 24 hours; // Reset period is 24 hours

    event Tipped(address indexed sender, address indexed recipient, uint256 amount);
    event Registered(address indexed account, address indexed registeredBy);
    event Unregistered(address indexed account, address indexed unregisteredBy);

    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address engineBackendWallet
    )
    ERC20Base(
        _defaultAdmin,
        _name,
        _symbol
    )
    {
        _setupRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
        _setupRole(REGISTER_ROLE, _defaultAdmin);
        _setupRole(TIP_ON_BEHALF_OF_ROLE, _defaultAdmin);

        _setupRole(TIP_ON_BEHALF_OF_ROLE, engineBackendWallet);
        _setupRole(REGISTER_ROLE, engineBackendWallet);
    }
    
    function registerAccount(address account) external onlyRole(REGISTER_ROLE) {
        isRegistered[account] = true;
        emit Registered(account, msg.sender);
    }
    
    function unregisterAccount(address account) external onlyRole(REGISTER_ROLE) {
        isRegistered[account] = false;
        emit Unregistered(account, msg.sender);
    }
    
    function _resetTipLimitIfNeeded(address account) internal {
        if (block.timestamp >= lastTipReset[account] + RESET_PERIOD) {
            tipsSentToday[account] = 0;
            lastTipReset[account] = block.timestamp;
        }
    }

    function tip(address to, address from, uint256 amount) external {
        _tip(to, from, amount);
    }

    function tipMany(address[] calldata to, address from, uint256 amount) external {
        for (uint256 i = 0; i < to.length; i++) {
            _tip(to[i], from, amount);
        }
    }
    
    function _tip(address to, address from, uint256 amount) internal {
        if (!isRegistered[from] && !hasRole(TIP_ON_BEHALF_OF_ROLE, msg.sender)) revert SenderNotRegistered();
        if (from == to) revert CannotTipYourself();
        // msg.sender must be the from or have the TIP_ON_BEHALF_OF_ROLE
        if (msg.sender != from && !hasRole(TIP_ON_BEHALF_OF_ROLE, msg.sender)) revert SenderNotAuthorized();
        
        _resetTipLimitIfNeeded(from);
        if (tipsSentToday[from] + amount > DAILY_TIP_LIMIT) revert DailyTipLimitExceeded();
        
        tipsSentToday[from] += amount;
        _mint(to, amount);

        emit Tipped(from, to, amount);
    }
}
