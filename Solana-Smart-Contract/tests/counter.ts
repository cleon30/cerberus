import * as anchor from "@project-serum/anchor";
import { AnchorError, Program } from "@project-serum/anchor";
import { assert, expect } from "chai";
import { Counter } from "../target/types/counter";
import { Whitelist } from "../target/types/whitelist";
import chai from "chai";
import { waitForDebugger } from "inspector";
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
  describe("counter",() => {

    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const LAMPORTS_PER_SOL = 1000000000;

    const CounterProgram = anchor.workspace.Counter as Program<Counter>;
    const WhitelistProgram = anchor.workspace.Whitelist as Program<Whitelist>;


    let authority = anchor.web3.Keypair.generate();
    let authority_fake = anchor.web3.Keypair.generate();
    let whitelist = anchor.web3.Keypair.generate();
    let counterPDA: anchor.web3.PublicKey;
    let counterBump: number;
    let account1 = anchor.web3.Keypair.generate();
    let account1PDA: anchor.web3.PublicKey;
    let account2 = anchor.web3.Keypair.generate();
    let account2PDA: anchor.web3.PublicKey;
    let account3 = anchor.web3.Keypair.generate();
    let account3PDA: anchor.web3.PublicKey;
    let number_of_accounts = 5;
    let airdrop_number =2;
    // let cleon_theory_time = number_of_accounts/12;
    let balance_before = CounterProgram.provider.connection.getBalance(authority.publicKey);
    let whitelistedAccounts: Array<anchor.web3.Keypair> = [];
    for(let i = 0; i < number_of_accounts; ++i) 
    {
      whitelistedAccounts.push(anchor.web3.Keypair.generate());
    }
    

    // before(async () => {
    //     // Top up all acounts that will need lamports for account creation
    //     await airdrop(provider.connection, authority,2);
        
    // });
   
    it("Creating a counter📝", async () => {
        await airdrop(provider.connection, authority,2);
        // await airdrop(provider.connection, authority,2);
        console.clear();
        console.log("\nAirdrop to authority complete!");
        let initial = await CounterProgram.provider.connection.getBalance(authority.publicKey);
        console.log("Initial SOL Balance:",`${initial / LAMPORTS_PER_SOL} SOL`);
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
        let counter = await CounterProgram.account.counter.fetch(counterPDA);
        console.log("Your counter PublicKey: ",counterPDA.toString());
        assert.equal(counter.count.toNumber(), 0);
        // console.log(counterPDA, counterBump);
    
    });
    
    it("Point the Counter to an associated Whitelist", async () => {
        
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
    });
    

    it("Add multiple users", async() =>{
      for(let i = 0; i < whitelistedAccounts.length ; ++i) {
          let wallet = whitelistedAccounts[i];
          let [PDA, _] = await anchor.web3.PublicKey.findProgramAddress(
            [whitelist.publicKey.toBuffer(), wallet.publicKey.toBuffer()],
            WhitelistProgram.programId
          );
      // console.log(counterPDA);
          await CounterProgram.methods
          .addOrRemove(wallet.publicKey, false)
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
          console.log("Adding Address", wallet.publicKey.toString(),"to the whitelist");
      }
      // await new Promise(f => setTimeout(f, cleon_theory_time *1000));
      let counter = await CounterProgram.account.counter.fetch(counterPDA);
      console.log("The current count is:", counter.count.toNumber());
    })
      
    it("Check wallet actually is in whitelist", async () => {
      let account2 = whitelistedAccounts[1];
      [account2PDA,] = await anchor.web3.PublicKey.findProgramAddress(
          [whitelist.publicKey.toBuffer(), account2.publicKey.toBuffer()],
          WhitelistProgram.programId
      );
      await WhitelistProgram.methods
      .checkAddress(account2.publicKey)
      .accounts({
        whitelist: whitelist.publicKey,
        pdaId: account2PDA,
      })
      .signers([])
      .rpc();
      chai.assert(true);

    });

    
      it("Deletes 50% of whitelisted accounts from the whitelist 📝✘", async() =>{
        
        let initBalance = await CounterProgram.provider.connection.getBalance(authority.publicKey);
        for(let i = 0; i < whitelistedAccounts.length/2 ; ++i) {
            let wallet = whitelistedAccounts[i];
            let [PDA, _] = await anchor.web3.PublicKey.findProgramAddress(
              [whitelist.publicKey.toBuffer(), wallet.publicKey.toBuffer()],
              WhitelistProgram.programId
            );
        
            
                await CounterProgram.methods
                .addOrRemove(wallet.publicKey, true)
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
                console.log("The account:", wallet.publicKey.toString(), "has been deleted from the whitelist")//," | total count:",counter.count.toNumber());
            
        }
        
        let counter = await CounterProgram.account.counter.fetch(counterPDA);
        let endBalance = await CounterProgram.provider.connection.getBalance(authority.publicKey);
        expect(endBalance).to.be.greaterThan(initBalance);
        console.log("The current count is ", counter.count.toNumber())
        console.log("The end balance of authority is:",`${endBalance / LAMPORTS_PER_SOL} SOL`, "vs authority init balance:",`${initBalance / LAMPORTS_PER_SOL} SOL`);
        
      })
      
    it("Check if deleted wallet actually is in whitelist🤨📝✘", async () => {
      let account1 = whitelistedAccounts[1];
      [account1PDA,] = await anchor.web3.PublicKey.findProgramAddress(
          [whitelist.publicKey.toBuffer(), account1.publicKey.toBuffer()],
          WhitelistProgram.programId
        );
      try{
          await WhitelistProgram.methods
          .checkAddress(account1.publicKey)
          .accounts({
              whitelist: whitelist.publicKey,
              pdaId: account1PDA,
          })
          .signers([])
          .rpc();
      }catch(e){
          console.log("✘ Error, this account does not belongs to whitelist");
      }
    })
    it("An user tries to add people without being admin 📝✘", async () => {
      let account1 = whitelistedAccounts[1];
      [account1PDA,] = await anchor.web3.PublicKey.findProgramAddress(
          [whitelist.publicKey.toBuffer(), account1.publicKey.toBuffer()],
          WhitelistProgram.programId
        );
      let wallet = whitelistedAccounts[0];
      let [PDA, _] = await anchor.web3.PublicKey.findProgramAddress(
          [whitelist.publicKey.toBuffer(), wallet.publicKey.toBuffer()],
          WhitelistProgram.programId
      );
      try{
          await CounterProgram.methods
          .addOrRemove(account1.publicKey, false)
          .accounts({
            authority: authority.publicKey,
            counter: counterPDA,
            pdaId: account1PDA,
            whitelisting: whitelist.publicKey,
            updateId: WhitelistProgram.programId,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([wallet])
          .rpc();
          
      }catch(e){
          console.log("✘ Error, this account is not the admin authority");
      }
    })
    it("An user tries to remove people without being admin 📝✘", async () => {
      let init_counter = await CounterProgram.account.counter.fetch(counterPDA);
      let account1 = whitelistedAccounts[1];
      [account1PDA,] = await anchor.web3.PublicKey.findProgramAddress(
          [whitelist.publicKey.toBuffer(), account1.publicKey.toBuffer()],
          WhitelistProgram.programId
        );
      let wallet = whitelistedAccounts[0];
      let [PDA, _] = await anchor.web3.PublicKey.findProgramAddress(
          [whitelist.publicKey.toBuffer(), wallet.publicKey.toBuffer()],
          WhitelistProgram.programId
      );
      try{
          await CounterProgram.methods
          .addOrRemove(account1.publicKey, true)
          .accounts({
            authority: authority.publicKey,
            counter: counterPDA,
            pdaId: account1PDA,
            whitelisting: whitelist.publicKey,
            updateId: WhitelistProgram.programId,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([wallet])
          .rpc();
          
      }catch(e){
          console.log("✘ Error, this account is not the admin authority");
      }
      let final_counter = await CounterProgram.account.counter.fetch(counterPDA);
      assert.equal(final_counter.count.toNumber(),init_counter.count.toNumber());
    })
    it("Retrieve all the money! 💰💰💰🔙🔙✘", async() =>{
      
      let initBalance = await CounterProgram.provider.connection.getBalance(authority.publicKey);
      for(let i = 0; i < whitelistedAccounts.length ; ++i) {
          let wallet = whitelistedAccounts[i];
          let [PDA, _] = await anchor.web3.PublicKey.findProgramAddress(
            [whitelist.publicKey.toBuffer(), wallet.publicKey.toBuffer()],
            WhitelistProgram.programId
          );
          
          try{
              await CounterProgram.methods
              .addOrRemove(wallet.publicKey, true)
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
              
              console.log("The account:", wallet.publicKey.toString(), "has been deleted from the whitelist")//," | total count;",counter.count.toNumber());
            } catch(e){
              console.error("The program expected this account to be already initialized");
            }
      }
      // await new Promise(f => setTimeout(f, cleon_theory_time *1000));
      let counter = await CounterProgram.account.counter.fetch(counterPDA);
      let endBalance = await CounterProgram.provider.connection.getBalance(authority.publicKey);
      expect(endBalance).to.be.greaterThan(initBalance);
      console.log("The current count is ", counter.count.toNumber())
      console.log("The end balance of authority is:",`${endBalance / LAMPORTS_PER_SOL} SOL`, "vs authority init balance:",`${initBalance / LAMPORTS_PER_SOL} SOL`);
    })
      
    after(async () =>{
      let counter = await CounterProgram.account.counter.fetch(counterPDA);
      let init = (await balance_before / LAMPORTS_PER_SOL) + airdrop_number;
      let endBalance = await CounterProgram.provider.connection.getBalance(authority.publicKey);
      let sol_spend = init - endBalance/LAMPORTS_PER_SOL;

      console.log("\n----------------");
      console.log("Statistics📊📈\n");
      console.log("Initial SOL Balance:", init);
      console.log("Balance after the Whitelisting:", endBalance/LAMPORTS_PER_SOL)
      console.log("Counter Total:", counter.count.toNumber());
      console.log("Total SOL Spent:", sol_spend);
      if (counter.count.toNumber() == 0){
          console.log("The counter count is 0, your remaining SOL is ", init - endBalance/LAMPORTS_PER_SOL); ;
      }else{
          console.log("SOL Spent per Address:",sol_spend/counter.count.toNumber());
      }

    })
})
