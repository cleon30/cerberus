import * as anchor from "@project-serum/anchor";
import {Program } from "@project-serum/anchor";

import { Counter } from "../target/types/counter";
import { Whitelist } from "../target/types/whitelist";
import { Minter } from "../target/types/minter";

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
const testNftTitle = ["Holana","Hoolana","Hooolana","Hoooolana","Hooooolana"];
const testNftSymbol = ["Holana","Holana","Holana","Holana","Holana"];
const testNftUri = ["https://raw.githubusercontent.com/rudranshsharma123/Certificate-Machine/main/JSON-Files/CLEON.json",
                  "https://raw.githubusercontent.com/rudranshsharma123/Certificate-Machine/main/JSON-Files/CLEON.json",
                  "https://raw.githubusercontent.com/rudranshsharma123/Certificate-Machine/main/JSON-Files/CLEON.json",
                  "https://raw.githubusercontent.com/rudranshsharma123/Certificate-Machine/main/JSON-Files/CLEON.json",
                  "https://raw.githubusercontent.com/rudranshsharma123/Certificate-Machine/main/JSON-Files/CLEON.json"];

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const authority = anchor.web3.Keypair.fromSecretKey(secret);
const arr2 = Object.values(kp2._keypair.secretKey);
const secret2 = new Uint8Array(arr2);
const whitelist = anchor.web3.Keypair.fromSecretKey(secret2);



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

    console.log("\x1b[1m","Initializing the whitelist 📝 !!!","\x1b[0m");
    console.log("....");

    await airdrop(provider.connection, authority,1);

    console.log("Airdrop to whitelist authority completed\n");
    console.log("...........................................");

    await new Promise(f => setTimeout(f,1000));

    [counterPDA, counterBump]= await anchor.web3.PublicKey.findProgramAddress(
      [
      Buffer.from(anchor.utils.bytes.utf8.encode("counter")), 
      authority.publicKey.toBuffer()
      ],
      CounterProgram.programId
    );
 
  try{
    console.log("Creating counter....");
    console.log(".....");
    await CounterProgram.methods
          .initCounter(counterBump)
          .accounts({
            authority: authority.publicKey,
            counter: counterPDA,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([authority])
          .rpc();
          console.log("\x1b[32m", "New counter created!");
          initialized_counter=true;
        
  }catch(_){
    console.log("\x1b[31m", "✘ Counter has already been initialized");
    initialized_counter = true;
  }
  try{
    console.log("\x1b[0m", "Pointing the counter to whitelist....");
    console.log(".....");
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
    console.log("\x1b[32m", "Count has successful pointed to the whitelist!!");
   
    initialized_pointing=true;
  }catch(_){
    console.log("\x1b[31m", "✘ Whitelist has already been pointed","\x1b[0m");
    initialized_pointing = true;
  }
  let counter = await CounterProgram.account.counter.fetch(counterPDA);
  console.log("\x1b[0m", "The default count for this whitelist is:", counter.count.toNumber());
}
const add_to_whitelist = async(new_account) =>{
 
  try{

    console.log("\n----------------");
    console.log("\x1b[1m","Address Received, starting the process..!!\n","\x1b[0m");

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
      console.log("The address", "\x1b[32m", account_new.toString(),"\x1b[0m", "has been added to the whitelist!");
      console.log("Number of people in the whitelist:", counter.count.toNumber());
      mint_iteration();

  }catch(e){
      
      let counter = await CounterProgram.account.counter.fetch(counterPDA);
      console.log("Conditions did not meet to add","\x1b[31m", account_new.toString(),"\x1b[0m", "to the whitelist!");
      console.log("The current whitelist count is:", counter.count.toNumber());
    }
}catch(e){
  console.log(e);
}
}



const getData = async() =>{
    fetch('http://127.0.0.1:8000/data/last')
    .then(res => res.text())
    .then(res =>{ if ((array.includes(res) == false) && res.length>40){
                 new_string = res.replace(/"/g,""); 
                
                 }
                }
    );
}

const interval = setInterval(() => {
    getData();
    if ((initialized_counter== false || initialized_pointing==false) && called_initialized== false){
        init_whitelisting();
        called_initialized = true;
    }
  
    if ((initialized_counter== true && initialized_pointing==true) 
        && array.includes(new_string)== false 
        && new_string != undefined){

          add_to_whitelist(new_string);
          array.push(new_string);
         
    }
  
   
    
}, 300);
const mint_iteration = async () => {
  console.log("\x1b[32m","Minting Process has begun!!","\x1b[0m");
  let position = 0;

  for (var i = 0; i < testNftTitle.length; i++) {

    
    position = i;

    mint_process(testNftTitle[i], testNftSymbol[i], testNftUri[i], new_string);
  
}

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

				console.log(title,"has been minted to:","\x1b[32m",address_recipient,"\x1b[0m");

			
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
			
				mint_process(title, symbol, json_url, address_recipient);
	}
}

