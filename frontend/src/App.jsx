import logo from './logo.svg';
import React, { useState, useEffect, useCallback } from "react";
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
  useEffect(() => {
    fetching()
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {todos[0]} <code>src/App.js</code> and save to reload.
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
