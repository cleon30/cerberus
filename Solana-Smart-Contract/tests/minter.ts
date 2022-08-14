import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Minter } from "../target/types/minter";
import { Keypair, PublicKey } from "@solana/web3.js";

	// Configure the client to use the local cluster.

	
// Configure the client to use the local cluster.
anchor.setProvider(anchor.AnchorProvider.env());
const program = anchor.workspace.Minter as Program<Minter>;
const provider = anchor.AnchorProvider.env();
const wallet = provider.wallet;
const testNftTitle = "Beta";
const testNftSymbol = "BETA";
const testNftUri =
	"https://raw.githubusercontent.com/rudranshsharma123/Certificate-Machine/main/JSON-Files/CLEON.json";

const buyer = new PublicKey("4mDqXYgn4y5D4CYnDPCE46xFNmrZwoRz3FtNihexRBFz");
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
	"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

const process =  async (title,symbol, json_url) => {
	
	
	const mint = Keypair.generate();
	
	try{
			const tokenAddress = await anchor.utils.token.associatedAddress({
				mint: mint.publicKey,
				owner: wallet.publicKey,
			});
			console.log(`New token: ${mint.publicKey}`);
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

			console.log("Metadata initialized");
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

			console.log("Master edition metadata initialized");
			try{
				
				await program.methods
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
				console.log("good");
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
			// console.log(`Request to sell NFT: ${mint} for ${saleAmount} lamports.`);
			console.log(`Owner's Token Address: ${ownerTokenAddress}`);
			console.log(`Buyer's Token Address: ${buyerTokenAddress}`);

			// Transact with the "sell" function in our on-chain program

			await program.methods
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
				process(title,symbol, json_url);
	}
}
process(testNftTitle, testNftSymbol, testNftUri);
