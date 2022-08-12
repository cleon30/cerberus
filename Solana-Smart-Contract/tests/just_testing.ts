import * as anchor from "@project-serum/anchor";
import { AnchorError, Program } from "@project-serum/anchor";
import { assert, expect } from "chai";
import { Counter } from "../target/types/counter";
import { Whitelist } from "../target/types/whitelist";
import chai from "chai";

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
  
  let whitelistedAccounts: Array<anchor.web3.Keypair> = [];
  for(let i = 0; i < 8; ++i) {
    whitelistedAccounts.push(anchor.web3.Keypair.generate());
    }
// base_accounture the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Whitelist as Program<Whitelist>;
  const authority = anchor.web3.Keypair.generate();

  let whitelistAccount = anchor.web3.Keypair.generate();
  await airdrop(authority);
    console.log("Airdrop to authority complete!");
    await program.methods
      .newWhitelist()
      .accounts({
        admin: authority.publicKey,
        whitelist: whitelistAccount.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([whitelistAccount, authority])
      .rpc();
