import logo from './logo.svg';
import React, { useState, useEffect, useCallback,useRef } from "react";
import idl1 from './counter.json';
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program, Provider, web3, utils } from '@project-serum/anchor';
import idl2 from './whitelist.json';
import kp from './keypair.json';


import './App.css';

function App() {
const [todos, setTodos] = useState([])
  

  const fetching = async() => {

      const response = await fetch("http://127.0.0.1:8000/data");
      const todos = await response.json()
      console.log(todos);
      setTodos(todos)
    
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
    let [requestCount, setRequestCount] = useState(0);
   
    // Run every second
    const delay = 1000;
  
    useInterval(() => {
      // Make the request here
      
      fetching()
      console.log(1);
    }, delay);
  
    return <h1>{requestCount}</h1>;
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
