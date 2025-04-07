// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DaiToken is ERC20, ReentrancyGuard {

    constructor() ERC20("Mock DAI Token", "mDAI") {
        // No initial mint here
    }

    function claim() external nonReentrant {
        uint256 ethBalance = msg.sender.balance;
        require(ethBalance > 0, "No ETH to mirror");

        _mint(msg.sender, ethBalance); 
    }
}
