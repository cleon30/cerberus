import logo from './logo.svg';
import React, { useState, useEffect, useCallback,useRef } from "react";
import idl1 from './counter.json';
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program, Provider, web3, utils } from '@project-serum/anchor';
import idl2 from './whitelist.json';
import kp from './keypair.json';
import './App.css';
import { Counter } from "./types/counter";
import { Whitelist } from "./types/whitelist";


async function airdrop(connection, destinationWallet, amount) {
  const airdropSignature = await connection.requestAirdrop(destinationWallet.publicKey, 
    amount * anchor.web3.LAMPORTS_PER_SOL);
  
  const latestBlockHash = await connection.getLatestBlockhash();

  const tx = await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature
  });
}

function App() {
  const [data, setData] = useState([]);
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const LAMPORTS_PER_SOL = 1000000000;
  // const CounterProgram = anchor.workspace.Counter as Program<Counter>;
  // const WhitelistProgram = anchor.workspace.Whitelist as Program<Whitelist>;
  

  const fetching = async() => {
      const response = await fetch("http://127.0.0.1:8000/data");
      const new_data = await response.json()
      setData(new_data)
  }



  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  function Request() {
   
    const delay = 1000;
  
    useInterval(() => {
    
      fetching()
    }, delay);
  
    return <h1>{data}</h1>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        <Request />
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
