import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Minter } from "../target/types/minter";
import { Keypair, PublicKey } from "@solana/web3.js";

	// Configure the client to use the local cluster.

const provider = anchor.AnchorProvider.env();
// Configure the client to use the local cluster.
anchor.setProvider(anchor.AnchorProvider.env());
const MinterProgram = anchor.workspace.Minter as Program<Minter>;

const wallet = provider.wallet;
const testNftTitle = "Massage";
const testNftSymbol = "SOLANAHH";
const testNftUri =
	"https://raw.githubusercontent.com/rudranshsharma123/Certificate-Machine/main/JSON-Files/CLEON.json";

const address_to_send = "CmZjvm2KJX4gJiyWimTxGEW4FtXRq6fnKtNJxTnTu7uK";
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
	"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

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
				mint_process(title, symbol, json_url, address_to_send);
	}
}
it("testing::", async()=>{
	mint_process(testNftTitle, testNftSymbol, testNftUri, address_to_send);
})

