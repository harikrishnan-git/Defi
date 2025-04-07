import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import DaiToken from "./abis/DaiToken.json";
import DappToken from "./abis/DappToken.json";
import TokenFarm from "./abis/TokenFarm.json";
import Header from "./Components/Header";
import Main from "./Components/Main";
import { config } from "./config";
import "./App.css";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState("0x0");
  const [daiToken, setDaiToken] = useState({});
  const [dappToken, setDappToken] = useState({});
  const [tokenFarm, setTokenFarm] = useState({});
  const [daiTokenBalance, setDaiTokenBalance] = useState("0");
  const [dappTokenBalance, setDappTokenBalance] = useState("0");
  const [stakingBalance, setStakingBalance] = useState("0");
  const [unstakingBonus, setUnstakingBonus] = useState("0");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("stake");

  useEffect(() => {
    const init = async () => {
      const provider_temp = await loadEthers();
      await setProvider(provider_temp);
      const signer = await provider_temp.getSigner();
      if (provider_temp) {
        await loadBlockchainData(provider, signer);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const balance = await provider.getBalance(account);
      setDaiTokenBalance(balance.toString());
    }, 5000); // update every 5s

    return () => clearInterval(interval);
  }, [account, daiToken]);

  const loadEthers = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Set provider globally if you like (optional)
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        return provider;
      } catch (err) {
        console.error("Error connecting to wallet:", err);
        if (err.code === 4001) {
          alert("User denied wallet connection.");
        } else {
          alert("An error occurred while connecting to the wallet.");
        }
        return null;
      }
    } else {
      alert("Non-Ethereum browser detected. Consider using MetaMask!");
      return null;
    }
  };

  const loadBlockchainData = async (provider, signer) => {
    const address = await signer.getAddress();
    setAccount(address);

    try {
      const dai = new ethers.Contract(config.daiToken, DaiToken.abi, signer);
      // const t = await dai.claim();
      // await t.wait();
      setDaiToken(dai);
    } catch (error) {
      alert("DaiToken contract not found on the network.");
      console.error("Error loading DaiToken:", error);
    }

    try {
      const dapp = new ethers.Contract(config.dappToken, DappToken.abi, signer);
      setDappToken(dapp);
    } catch (error) {
      alert("DappToken contract not found on the network.");
      console.error("Error loading DappToken:", error);
    }

    try {
      const farm = new ethers.Contract(config.tokenFarm, TokenFarm.abi, signer);
      setTokenFarm(farm);
    } catch (error) {
      alert("TokenFarm contract not found on the network.");
      console.error("Error loading TokenFarm:", error);
    }
    setLoading(false);
  };

  const stakeTokens = async (amount) => {
    setLoading(true);
    console.log("tokenFarm.address", tokenFarm?.address);
    await daiToken.approve(tokenFarm.address, amount);
    console.log("Staking amount:", amount);
    const tx2 = await tokenFarm.stakeTokens(amount);
    await tx2.wait();
    console.log("left staking");

    setLoading(false);
  };

  const unstakeTokens = async () => {
    setLoading(true);
    const tx = await tokenFarm.unstakeTokens();
    await tx.wait();
    setLoading(false);
  };

  const getUnstakingBonus = async () => {
    setLoading(true);
    try {
      const bonus = await tokenFarm.getBonus();
      setUnstakingBonus(bonus.toString());
      alert("Obtained bonus: " + bonus);
    } catch (error) {
      console.error("Error getting unstaking bonus:", error);
    }
    setLoading(false);
  };

  const transferToken = async (to, amount) => {
    setLoading(true);
    const tx = await tokenFarm.transferToken(to, amount);
    await tx.wait();
    setLoading(false);
  };

  // Change background color based on page
  useEffect(() => {
    const pageBackgrounds = {
      stake: "#1e5631", // Green for staking
      transfer: "#34495e", // Teal for transfers
    };

    document.body.style.background = pageBackgrounds[page] || "#16a085";

    return () => {
      document.body.style.background = "";
    };
  }, [page]);

  return (
    <div className="h-full">
      <Header setPage={setPage} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="content mr-auto ml-auto">
              {loading ? (
                <p id="loader" className="text-center">
                  Loading...
                </p>
              ) : (
                <Main
                  tokenFarm={tokenFarm}
                  dappToken={dappToken}
                  daiTokenBalance={daiTokenBalance}
                  dappTokenBalance={dappTokenBalance}
                  stakingBalance={stakingBalance}
                  stakeTokens={stakeTokens}
                  unstakeTokens={unstakeTokens}
                  unstakingBonus={unstakingBonus}
                  transferToken={transferToken}
                  page={page}
                  account={account}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
