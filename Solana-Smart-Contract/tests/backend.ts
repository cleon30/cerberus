import * as anchor from "@project-serum/anchor";
import { AnchorError, Program } from "@project-serum/anchor";
import { assert, expect } from "chai";
// import { Counter } from "../target/types/counter";
// import { Whitelist } from "../target/types/whitelist";
import chai from "chai";
const cluster = "devnet"
const wallet = "~/.config/solana/id.json"

const url = "https://anchor.projectserum.com"
import { waitForDebugger } from "inspector";
const fetch = require('node-fetch');
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
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
const script_function = async() =>{
    

}


const getData = async() =>{
    fetch('http://127.0.0.1:8000/data')
    .then(res => res.text())
    .then(text => console.log(text));

}

const interval = setInterval(() => {
    // script_function();
    getData();
    }, 1000);

