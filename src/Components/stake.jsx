import React, { useState } from "react";
import { ethers } from "ethers";
import dai from "/dai.png";

export default function stake({
  inputRef,
  daiTokenBalance,
  handleStake,
  handleUnstake,
  stakingBalance,
  stakeTokens,
  unstakeTokens,
  unstakingBonus,
  account,
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="">
      <form className="mb-4" onSubmit={handleStake}>
        {/* <div className="text-center mb-4">
          <h2 className="text-white">Stake Tokens</h2>
          <span className="text-dark">
            Balance: {window.web3.utils.fromWei(daiTokenBalance, "Ether")} mDAI
            <br />
            Account: {account}
          </span>
        </div> */}

        <div className="text-center mb-4">
          {/* <h2 className="text-white">Stake Tokens</h2> */}
          <h2 style={{ color: "#072a40", fontWeight: "bold" }}>Stake Tokens</h2>
          <span style={{ color: "#0c3c4c", fontWeight: "bold" }}>
            Balance: {ethers.formatEther(daiTokenBalance || "0")} mDAI
            <br />
            Account: {account}
          </span>
        </div>

        {/* Input Group for Staking Amount */}
        <div className="form-group mb-4">
          <label
            style={{ color: "#072a40", fontWeight: "bold" }}
            htmlFor="receiverAddress"
          >
            <b>Staking Amount</b>
          </label>
          <div className="input-group">
            <input
              type="number"
              ref={inputRef}
              className="form-control form-control-lg"
              placeholder="0"
              required
              min="1" // Ensure the amount is at least 1
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <img src={dai} height="32" alt="DAI Token" />
                &nbsp; mDAI
              </div>
            </div>
          </div>
          {/* <small className="form-text text-muted">
            Enter the amount of DAI to stake.
          </small> */}
          <small
            className="form-text"
            style={{ color: "#0c3c4c", fontWeight: "bold" }}
          >
            Enter the amount of DAI to stake.
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-success btn-block btn-lg"
          disabled={loading} // Disable button if loading
        >
          {loading ? "Staking..." : "STAKE!"}
        </button>
      </form>

      {/* Unstake Button */}
      <button
        className="btn btn-danger btn-block btn-lg mt-2"
        onClick={handleUnstake}
      >
        UN-STAKE
      </button>
    </div>
  );
}
