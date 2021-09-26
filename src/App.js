import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  let { ethereum } = window;

  const checkWallet = async () => {
    try {
      if (ethereum) {
        console.log("Wallet found", ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          let selectedAcc = accounts[0];
          console.log("Current Account:", selectedAcc);
          setAccount(selectedAcc);
        } else {
          console.log("No account found");
        }
      } else {
        console.log("No wallet found!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    if (!ethereum) {
      return alert("You need a MetaMask Wallet!");
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    console.log("Connected", accounts[0]);
    setAccount(accounts[0]);
  };

  useEffect(() => {
    checkWallet();
  }, []);

  return (
    <div className="App">
      <div className="welcome">
        <div className="title">👋 'sup</div>
        <div className="subtitle">
          I'm Max, webdev interested in blockchain. Connect your Ethereum wallet
          and wave at me! 😎
        </div>
        {account === "" ? (
          <button className="waveButton" id="notLogged" onClick={() => connectWallet()}>
            Connect your MetaMask Wallet
          </button>
        ) : (
          <button className="waveButton" onClick={null}>
            👋👋👋
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
