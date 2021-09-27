import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./utils/WavePortal.json";
import "./App.css";
import { Loading } from "./components/Loading";
import { Message } from "./components/Message";
require("dotenv").config();

function App() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState(false);
  const [mining, setMining] = useState(false);
  const [waves, setWaves] = useState([]);
  const [totalWaves, setTotalWaves] = useState(null);
  const [message, setMessage] = useState("");
  let { ethereum } = window;
  const contractAddress = "0x9b9dA67e079B36f70f7771cD58E0b75eEd6026De";
  
  //let abi = JSON.parse(contractABI)

  const checkWallet = async () => {
    try {
      if (ethereum) {
        console.log("Wallet found", ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          let selectedAcc = accounts[0];
          console.log("Current Account:", selectedAcc);
          setAccount(selectedAcc);
          getAllWaves();
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

  const getTotalWaves = async () => {
    if (ethereum && account) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const waveContract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );

      let count = await waveContract.getTotalWaves();
      setTotalWaves(count.toNumber());
    }
  };

  const getAllWaves = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const waveContract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );

      const allWaves = await waveContract.getAllWaves();
      console.log(allWaves[0]);
      let wavesArr = [];

      allWaves.forEach((e) => {
        wavesArr.push({
          adr: e.waver,
          time: new Date(e.timestamp * 1000),
          msg: e.message,
        });
      });

      setWaves(wavesArr.reverse());

      // waveContract.on("NewWave", (from, timestamp, message) => {
      //   console.log("NewWave", from, timestamp, message);

      //   setWaves((prevState) => [
      //     {
      //       address: from,
      //       timestamp: new Date(timestamp * 1000),
      //       message: message,
      //     },
      //     ...prevState,
      //   ]);
      // });
    } catch (err) {
      console.log(err);
    }
  };

  const wave = async () => {
    setError(false);
    try {
      if (ethereum) {
        setMining(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveContract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          signer
        );

        let count = await waveContract.getTotalWaves();
        console.log("total waves:", count.toNumber());

        const waveTxn = await waveContract.wave(message, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await waveContract.getTotalWaves();

        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("metamask not found");
      }
    } catch (err) {
      console.log(err);
      setError(true);
      console.log("whooops no money")
    }
    setMining(false);
    let currTime = new Date(Date.now());
    let newWave = {
      msg: message,
      time: currTime,
      adr: account,
    };
    if (error) {
      setWaves((oldArr) => [newWave, ...oldArr]);
      setTotalWaves(totalWaves + 1);
      setMessage("");
    }
  };

  useEffect(() => {
    checkWallet();
    getTotalWaves();

    const card = document.querySelector(".title");
    const container = document.querySelector(".titleContainer");

    container.addEventListener("mousemove", (e) => {
      let xAxis = (window.innerWidth / 2 - e.pageX) / 10 + 0.8;
      let yAxis = (window.innerHeight / 2 - e.pageY) / 10 - 34.4;
      card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;

      return <div>{xAxis}</div>;
    });

    container.addEventListener("mouseenter", (e) => {
      card.style.transition = "0.1s ";
      //Popout
    });
    //Animate Out
    container.addEventListener("mouseleave", (e) => {
      card.style.transition = "0.5s";
      card.style.transform = `rotateY(0deg) rotateX(0deg)`;
      //Popback
    });
  }, [account]);
  let key = 0
  return (
    <div className="App">
      <div className="welcome">
        <div className="titleContainer">
          <div className="title">👋 'sup</div>
        </div>
        <div className="subtitle">
          I'm Max, webdev interested in blockchain. Connect your Ethereum wallet
          and wave at me! 😎
        </div>
        {account === "" ? (
          <button
            className="waveButton"
            id="notLogged"
            onClick={() => connectWallet()}
          >
            Connect your MetaMask Wallet
          </button>
        ) : mining ? (
          <Loading />
        ) : (
          <div>
            <form onSubmit={wave}>
              <input
                className="msgInput"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="waveButton">
                👋👋👋
              </button>
            </form>
          </div>
        )}
      </div>
      <div>
        {account === "" ? (
          "Connect your wallet to see more"
        ) : (
          <div className="dataContainer">
            <div className="totalWaves">
              Total Waves: {totalWaves === null ? <Loading /> : totalWaves}
            </div>
            <div className="msgContainer">
              {waves.map((e) => {
                return <Message key = {key +=1} msg={e.msg} time={e.time} adr={e.adr} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
