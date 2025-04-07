// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm is ReentrancyGuard {
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    mapping(address => uint) public depositStart;
    mapping(address => uint) public unstakingBonus;

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function stakeTokens(uint _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // Trasnfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;


        // Add user to stakers array *only* if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;

    }

    // Unstaking Tokens (Withdraw)
    function unstakeTokens() public {
        // Fetch staking balance
        uint balance = stakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);

        uint depositTime = block.timestamp - depositStart[msg.sender];

        //31668017 - interest(10% APY) per second for min. deposit amount (0.01 ETH), cuz:
        //1e15(10% of 0.01 ETH) / 31577600 (seconds in 365.25 days)

        //(etherBalanceOf[msg.sender] / 1e16) - calc. how much higher interest will be (based on deposit), e.g.:
        //for min. deposit (0.01 ETH), (etherBalanceOf[msg.sender] / 1e16) = 1 (the same, 31668017/s)
        //for deposit 0.02 ETH, (etherBalanceOf[msg.sender] / 1e16) = 2 (doubled, (2*31668017)/s)
        //uint interestPerSecond = 1/3166801700;
        uint interest = depositTime;

        // Reset staking balance
        stakingBalance[msg.sender] = 0;
        depositStart[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;
        
        //updating bonus
        //uint bal=dappToken.balanceOf(msg.sender);
        uint bonus=balance*interest/100;
        unstakingBonus[msg.sender]=bonus;
        dappToken.transfer(owner,balance);
        dappToken.transfer(msg.sender,bonus);
    }

    function getBonus() public view returns (uint)
    {
        return unstakingBonus[msg.sender];
    }

    function transferToken(address _to,uint _amount) public payable returns(bool success){
        require(isStaking[_to]==true,"This account is not in this token farm");
        require(_amount>0,"Transfer money needs to be greater than 0");

        dappToken.transferFrom(msg.sender, _to, _amount);
        return true;
    }

    // Issuing Tokens
    function issueTokens() public {
        // Only owner can call this function
        require(msg.sender == owner, "caller must be the owner");

        // Issue tokens to all stakers
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                dappToken.transfer(recipient, balance);
                dappToken.approve(recipient,balance);
            }
        }
    }
}
