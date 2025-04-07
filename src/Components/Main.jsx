import React, { useRef, useState } from "react";
import { ethers, parseEther } from "ethers";
import dai from "/dai.png";
import dapp from "/dapp.png";
import Stake from "./stake.jsx";
import Transfer from "./Transfer.jsx";

const Main = ({
  tokenFarm,
  dappToken,
  stakingBalance,
  dappTokenBalance,
  daiTokenBalance,
  stakeTokens,
  unstakeTokens,
  unstakingBonus,
  transferToken,
  page,
  account,
}) => {
  const inputRef = useRef(null);

  const handleStake = (event) => {
    event.preventDefault();
    let amount = inputRef.current.value.toString();
    dappToken.approve(tokenFarm.address, amount);
    amount = parseEther(amount);
    stakeTokens(amount);
  };

  const handleUnstake = (event) => {
    event.preventDefault();
    unstakeTokens();
    console.log("Unstaking completed!");
    console.log("Bonus:", unstakingBonus);
  };

  const handleTransfer = (reciever, amount) => {
    amount = parseEther(amount);
    dappToken.approve(tokenFarm.address, amount);
    transferToken(reciever, amount);
  };

  return (
    <div id="content" className="mt-2">
      <table className="table table-borderless text-white text-center">
        <thead>
          <tr>
            <th scope="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="col">
              <img src={dai} alt="DAI Token" />
            </th>
            <th scope="col">
              <img src={dapp} alt="Dapp Token" />
            </th>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>
              {stakingBalance != null
                ? ethers.formatEther(BigInt(stakingBalance))
                : 0}{" "}
              mDAI
            </td>
            <td>
              {dappTokenBalance != null
                ? ethers.formatEther(BigInt(dappTokenBalance))
                : 0}{" "}
              DAPP
            </td>
          </tr>
        </tbody>
      </table>

      <div className="card mb-4 glassmorphism">
        <div
          className="card-body rounded border-0 glassmorphism"
          style={{
            background: page === "stake" ? "#2cab73" : "#3498db", // Teal for stake, Blue for transfer
            transition: "background 0.5s ease",
          }}
        >
          {page === "stake" ? (
            <Stake
              inputRef={inputRef}
              daiTokenBalance={daiTokenBalance}
              handleStake={handleStake}
              handleUnstake={handleUnstake}
              stakingBalance={stakingBalance}
              stakeTokens={stakeTokens}
              unstakeTokens={unstakeTokens}
              unstakingBonus={unstakingBonus}
              account={account}
            />
          ) : (
            <Transfer
              daiTokenBalance={daiTokenBalance}
              handleTransfer={handleTransfer}
              account={account}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
