// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// const JAN_1ST_2030 = 1893456000;
// const ONE_GWEI = 1_000_000_000n;

const deploy = buildModule("LockModule", (m) => {
  const Dai = m.contract("DaiToken");

  const Dapp = m.contract("DappToken");

  const TokenFarm = m.contract("TokenFarm", [Dai, Dapp]);

  return { Dai, Dapp, TokenFarm };
});

export default deploy;
