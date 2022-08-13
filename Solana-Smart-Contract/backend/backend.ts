import * as anchor from "@project-serum/anchor";
import { AnchorError, Program } from "@project-serum/anchor";
import { assert, expect } from "chai";
import { Counter } from "../target/types/counter";
import { Whitelist } from "../target/types/whitelist";
import chai from "chai";
import { waitForDebugger } from "inspector";
const fetch = require('node-fetch');

const array = [];

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const LAMPORTS_PER_SOL = 1000000000;
const CounterProgram = anchor.workspace.Counter as Program<Counter>;
const WhitelistProgram = anchor.workspace.Whitelist as Program<Whitelist>;
let authority = anchor.web3.Keypair.generate();
let whitelist = anchor.web3.Keypair.generate();
let counterPDA: anchor.web3.PublicKey;
let counterBump: number;
let initialized = false;

const init = async() =>{
  
    await airdrop(provider.connection, authority,2);

    [counterPDA, counterBump]= await anchor.web3.PublicKey.findProgramAddress(
      [
      Buffer.from(anchor.utils.bytes.utf8.encode("counter")),
      authority.publicKey.toBuffer()
      ],
      CounterProgram.programId
    );

    await CounterProgram.methods
          .initCounter(counterBump)
          .accounts({
            authority: authority.publicKey,
            counter: counterPDA,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

    await CounterProgram.methods
    .pointToWhitelist()
    .accounts({
      authority: authority.publicKey,
      counter: counterPDA,
      whitelisting: whitelist.publicKey,
      pointerToWhitelistId: WhitelistProgram.programId,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([authority, whitelist])
    .rpc();
}

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
  [counterPDA, counterBump]= await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode("counter")), authority.publicKey.toBuffer()],
    CounterProgram.programId
    );
    await CounterProgram.methods
          .initCounter(counterBump)
          .accounts({
            authority: authority.publicKey,
            counter: counterPDA,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([authority])
          .rpc();

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

