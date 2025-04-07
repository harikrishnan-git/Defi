const { expect } = require("chai");
const { ethers } = require("hardhat");

function tokens(n) {
  return ethers.parseUnits(n, "ether");
}

describe("TokenFarm", function () {
  let daiToken, dappToken, tokenFarm;
  let owner, investor;

  beforeEach(async () => {
    [owner, investor] = await ethers.getSigners();

    // Deploy contracts
    const DaiToken = await ethers.getContractFactory("DaiToken");
    daiToken = await DaiToken.deploy();
    await daiToken.waitForDeployment();

    const DappToken = await ethers.getContractFactory("DappToken");
    dappToken = await DappToken.deploy();
    await dappToken.waitForDeployment();

    const TokenFarm = await ethers.getContractFactory("TokenFarm");
    tokenFarm = await TokenFarm.deploy(
      await dappToken.getAddress(),
      await daiToken.getAddress()
    );
    await tokenFarm.waitForDeployment();

    // Transfer all Dapp tokens to the TokenFarm
    await dappToken.transfer(await tokenFarm.getAddress(), tokens("1000000"));

    // Transfer Mock DAI tokens to investor
    await daiToken.transfer(await investor.getAddress(), tokens("100"));
  });

  describe("Mock DAI deployment", () => {
    it("has a name", async () => {
      expect(await daiToken.name()).to.equal("Mock DAI Token");
    });
  });

  describe("DApp Token deployment", () => {
    it("has a name", async () => {
      expect(await dappToken.name()).to.equal("DApp Token");
    });
  });

  describe("Token Farm deployment", () => {
    it("has a name", async () => {
      expect(await tokenFarm.name()).to.equal("Dapp Token Farm");
    });

    it("contract has tokens", async () => {
      const balance = await dappToken.balanceOf(await tokenFarm.getAddress());
      expect(balance.toString()).to.equal(tokens("1000000").toString());
    });
  });

  describe("Farming tokens", () => {
    it("rewards investors for staking mDai tokens", async () => {
      // Check investor balance before staking
      let result = await daiToken.balanceOf(await investor.getAddress());
      expect(result.toString()).to.equal(tokens("100").toString());

      // Approve and Stake Mock DAI Tokens
      await daiToken
        .connect(investor)
        .approve(await tokenFarm.getAddress(), tokens("100"));
      await tokenFarm.connect(investor).stakeTokens(tokens("100"));

      // Check balances after staking
      result = await daiToken.balanceOf(await investor.getAddress());
      expect(result.toString()).to.equal(tokens("0").toString());

      result = await daiToken.balanceOf(await tokenFarm.getAddress());
      expect(result.toString()).to.equal(tokens("100").toString());

      result = await tokenFarm.stakingBalance(await investor.getAddress());
      expect(result.toString()).to.equal(tokens("100").toString());

      result = await tokenFarm.isStaking(await investor.getAddress());
      expect(result).to.equal(true);

      // Issue Tokens
      await tokenFarm.connect(owner).issueTokens();

      result = await dappToken.balanceOf(await investor.getAddress());
      expect(result.toString()).to.equal(tokens("100").toString());

      // Ensure only owner can issue tokens
      await expect(tokenFarm.connect(investor).issueTokens()).to.be.reverted;

      // Unstake tokens
      await tokenFarm.connect(investor).unstakeTokens();

      result = await daiToken.balanceOf(await investor.getAddress());
      expect(result.toString()).to.equal(tokens("100").toString());

      result = await daiToken.balanceOf(await tokenFarm.getAddress());
      expect(result.toString()).to.equal(tokens("0").toString());

      result = await tokenFarm.stakingBalance(await investor.getAddress());
      expect(result.toString()).to.equal(tokens("0").toString());

      result = await tokenFarm.isStaking(await investor.getAddress());
      expect(result).to.equal(false);
    });
  });
});
