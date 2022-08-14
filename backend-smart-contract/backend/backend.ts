import * as anchor from "@project-serum/anchor";
import { AnchorError, Program } from "@project-serum/anchor";
import { assert, expect } from "chai";
import { Counter } from "../target/types/counter";
import { Whitelist } from "../target/types/whitelist";
import { Minter } from "../target/types/minter";
import chai from "chai";
import { waitForDebugger } from "inspector";
import { Keypair, PublicKey } from "@solana/web3.js";
import kp from '../keypair.json';
import kp2 from '../keypair_whitelist.json';
console.clear();

const fetch = require('node-fetch');
const array = [];
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const CounterProgram = anchor.workspace.Counter as Program<Counter>;
const WhitelistProgram = anchor.workspace.Whitelist as Program<Whitelist>;
const MinterProgram = anchor.workspace.Minter as Program<Minter>;

var counterPDA: anchor.web3.PublicKey;
let counterBump: number;
var initialized_counter= false;
var initialized_pointing= false;
var called_initialized = false;
var new_string = null;
const wallet = provider.wallet;
const testNftTitle = "Massage";
const testNftSymbol = "SOLANAHH";
const testNftUri = "https://raw.githubusercontent.com/rudranshsharma123/Certificate-Machine/main/JSON-Files/CLEON.json";
// const address_to_send = "CmZjvm2KJX4gJiyWimTxGEW4FtXRq6fnKtNJxTnTu7uK";
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const authority = anchor.web3.Keypair.fromSecretKey(secret);
const arr2 = Object.values(kp2._keypair.secretKey);
const secret2 = new Uint8Array(arr2);
const whitelist = anchor.web3.Keypair.fromSecretKey(secret2);
// const whitelist = anchor.web3.Keypair.generate();


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

const init_whitelisting = async() =>{

    console.log("Initializing the whitelist 📩📍!")
    console.log("....")
    console.log(".......")
    console.log(".........")
    await airdrop(provider.connection, authority,1);
    await new Promise(f => setTimeout(f,1000));

    [counterPDA, counterBump]= await anchor.web3.PublicKey.findProgramAddress(
      [
      Buffer.from(anchor.utils.bytes.utf8.encode("counter")), 
      authority.publicKey.toBuffer()
      ],
      CounterProgram.programId
    );
 
  try{
    await CounterProgram.methods
          .initCounter(counterBump)
          .accounts({
            authority: authority.publicKey,
            counter: counterPDA,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([authority])
          .rpc();
          console.log("New counter created!");
          initialized_counter=true;
        
  }catch(_){
    console.log("✘ Counter has already been initialized");
    initialized_counter = true;
  }
  try{

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
    console.log("Count has successful pointed to the whitelist!!");
    initialized_pointing=true;
  }catch(_){
    console.log("✘ Whitelist has already been pointed");
    initialized_pointing = true;
  }
  let counter = await CounterProgram.account.counter.fetch(counterPDA);
  console.log(counter.count.toNumber());
}
const add_to_whitelist = async(new_account) =>{
 
  try{
    const account_new = new PublicKey(new_account);

    let [PDA, _] = await anchor.web3.PublicKey.findProgramAddress(
      [whitelist.publicKey.toBuffer(), account_new.toBuffer()],
      WhitelistProgram.programId
    )

    try{
      
        await CounterProgram.methods
        .addOrRemove(account_new, false)
        .accounts({
          authority: authority.publicKey,
          counter: counterPDA,
          pdaId: PDA,
          whitelisting: whitelist.publicKey,
          updateId: WhitelistProgram.programId,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      
      let counter = await CounterProgram.account.counter.fetch(counterPDA);
      console.log("Adding", account_new.toString(), "to the whitelist");
      console.log(counter.count.toNumber());

  }catch(e){
      
      let counter = await CounterProgram.account.counter.fetch(counterPDA);
      console.log("Conditions did not meet to add", account_new.toString(), "to the whitelist");
      console.log("The current whitelist count is:", counter.count.toNumber());
    }
}catch(e){
  console.log(e);
}
}



const getData = async() =>{
    fetch('http://127.0.0.1:8000/data/last')
    .then(res => res.text())
    .then(res =>{ if ((array.includes(res) == false) && res.length==46){
                 new_string = res.replace(/"/g,""); 
                 }
                }
    );
}

const interval = setInterval(() => {
    // script_function();
    if ((initialized_counter== false || initialized_pointing==false) && called_initialized== false){
        init_whitelisting();
        called_initialized = true;
    }
  
    if ((initialized_counter== true && initialized_pointing==true) 
        && array.includes(new_string)== false 
        && new_string != undefined){

          add_to_whitelist(new_string);

          console.log(new_string);
          array.push(new_string);
         
    }
  
    getData();
    
}, 1000);
const mint_iteration = async () => {
  
}

const mint_process =  async (title, symbol, json_url, address_recipient) => {

	const buyer = new PublicKey(address_recipient);
	const mint = Keypair.generate();
	
	try{
			const tokenAddress = await anchor.utils.token.associatedAddress({
				mint: mint.publicKey,
				owner: wallet.publicKey,
			});
			
			const metadataAddress = (
				await anchor.web3.PublicKey.findProgramAddress(
					[
						Buffer.from("metadata"),
						TOKEN_METADATA_PROGRAM_ID.toBuffer(),
						mint.publicKey.toBuffer(),
					],
					TOKEN_METADATA_PROGRAM_ID,
				)
			)[0];

			const masterEditionAddress = (
				await anchor.web3.PublicKey.findProgramAddress(
					[
						Buffer.from("metadata"),
						TOKEN_METADATA_PROGRAM_ID.toBuffer(),
						mint.publicKey.toBuffer(),
						Buffer.from("edition"),
					],
					TOKEN_METADATA_PROGRAM_ID,
				)
			)[0];
			try{
				
				await MinterProgram.methods
					.mint(title, symbol, json_url)
					.accounts({
						masterEdition: masterEditionAddress,
						metadata: metadataAddress,
						mint: mint.publicKey,
						tokenAccount: tokenAddress,
						mintAuthority: wallet.publicKey,
						tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
					})
					.signers([mint])
					.rpc();

				console.log(title, "has been minted to: ", address_recipient);

				}catch(e){

					// await new Promise(f => setTimeout(f, 300))
				};
			const ownerTokenAddress = await anchor.utils.token.associatedAddress({
				mint: mint.publicKey,
				owner: wallet.publicKey,
			});
			const buyerTokenAddress = await anchor.utils.token.associatedAddress({
				mint: mint.publicKey,
				owner: buyer,
			});

			await MinterProgram.methods
				.send()
				.accounts({
					mint: mint.publicKey,
					ownerTokenAccount: ownerTokenAddress,
					ownerAuthority: wallet.publicKey,
					buyerTokenAccount: buyerTokenAddress,
					buyerAuthority: buyer,
				})
				.rpc();

	}catch(e){
				// await new Promise(f => setTimeout(f, 300))
				mint_process(title, symbol, json_url, address_recipient);
	}
}

