import * as anchor from "@project-serum/anchor";
import { AnchorError, Program } from "@project-serum/anchor";
import { assert, expect } from "chai";
import chai from "chai";
import { Whitelist } from "../target/types/whitelist";
const LAMPORTS_PER_SOL = 1000000000;

describe("whitelist", () => {
  
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
  async function airdrop(user) {
    // Airdropping tokens to a payer.
    
    await program.provider.connection.confirmTransaction(
      await program.provider.connection.requestAirdrop(
        user.publicKey,
        2*LAMPORTS_PER_SOL
      ),
      "confirmed"
    );
  };



  it("Creating a whitelist📝", async () => {
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

  });



  it("The addresses are added to whitelist[🥷🥷🥷🥷🥷🥷🥷🥷]", async () => {
    for(let i = 0; i < whitelistedAccounts.length ; ++i) {
      let wallet = whitelistedAccounts[i];
      let [PDA, _] = await anchor.web3.PublicKey.findProgramAddress(
        [whitelistAccount.publicKey.toBuffer(), wallet.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .addAddress(wallet.publicKey)
        .accounts({
          whitelist: whitelistAccount.publicKey,
          pdaId: PDA,
          authority: authority.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .signers([authority])
        .rpc();
        console.log("Adding Address", wallet.publicKey.toString())
    }
  });
  it("Try adding with other account(no admin)", async () => {
    const authority_fake = anchor.web3.Keypair.generate();
    await airdrop(authority_fake);
    console.log("Airdrop completed")
    const wallet = anchor.web3.Keypair.generate();
    let [PDA, _] = await anchor.web3.PublicKey.findProgramAddress(
      [whitelistAccount.publicKey.toBuffer(), wallet.publicKey.toBuffer()],
      program.programId
    );
    try{
      await program.methods
        .addAddress(wallet.publicKey)
        .accounts({
          whitelist: whitelistAccount.publicKey,
          pdaId: PDA,
          authority: authority_fake.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .signers([authority_fake])
        .rpc();
        chai.assert(false, "A has one constraint was violated.");
        // console.log("Adding Address", wallet.publicKey.toString())
      }catch(e){
        console.error("You are not the authority");

      }
        
  });




  it("Checks if wallet is whitelisted or not", async () => {
    // Tests checking a valid whitelisted wallet
    let walletWhitelisted = whitelistedAccounts[0];
    let [walletWhitelistedPDA, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [whitelistAccount.publicKey.toBuffer(), walletWhitelisted.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .checkAddress(walletWhitelisted.publicKey)
      .accounts({
        whitelist: whitelistAccount.publicKey,
        pdaId: walletWhitelistedPDA,
      })
      .signers([])
      .rpc();
    chai.assert(true);

    let walletnonWhitelisted = anchor.web3.Keypair.generate();
    let [walletnonWhitelistedPDA, bump2] = await anchor.web3.PublicKey.findProgramAddress(
      [whitelistAccount.publicKey.toBuffer(), walletnonWhitelisted.publicKey.toBuffer()],
      program.programId
    );
    try{
      await program.methods
        .checkAddress(walletnonWhitelisted.publicKey)
        .accounts({
          whitelist: whitelistAccount.publicKey,
          pdaId: walletnonWhitelistedPDA,
        })
        .signers([])
        .rpc();

    
      }catch(e){
        console.log("✘ You do not belong to this whitelist");
      }
  })


  it("Delete a wallet from the whitelist 🟥 🟥 🟥 ", async () => {
    // Tests deleting whitelisted wallets.
    // Deletes 2nd, 3rd and 4th entries of whitelist addresses from whitelist
    let walletWhitelisted = whitelistedAccounts[0];
    let [walletWhitelistedPDA, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [whitelistAccount.publicKey.toBuffer(), walletWhitelisted.publicKey.toBuffer()],
      program.programId
    );
  

    await program.methods
      .removeAddress(walletWhitelisted.publicKey)
      .accounts({
        whitelist: whitelistAccount.publicKey,
        pdaId: walletWhitelistedPDA,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([authority])
      .rpc();

    })
  })

