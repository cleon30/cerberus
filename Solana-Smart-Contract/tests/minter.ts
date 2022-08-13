import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Minter } from "../target/types/minter";
import { Keypair, PublicKey } from "@solana/web3.js";


describe("minter", () => {
	// Configure the client to use the local cluster.

	
// Configure the client to use the local cluster.
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.Minter as Program<Minter>;

const provider = anchor.AnchorProvider.env();
const wallet = provider.wallet;
const CREATE_MINT_SEED = "createmints";
const testNftTitle = "Beta";
const testNftSymbol = "BETA";
const testNftUri =
	"https://raw.githubusercontent.com/rudranshsharma123/Certificate-Machine/main/JSON-Files/CLEON.json";
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
	"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);
const buyer = new PublicKey("9M19njTrbdaoL1BnLNi87M9CChdNiShFeYUTV9VkAnyp");
// it("Creates the Storage Account", async () => {
// 	const [pda, _] = await PublicKey.findProgramAddress(
// 		[
// 			wallet.publicKey.toBuffer(),
// 			Buffer.from(anchor.utils.bytes.utf8.encode(CREATE_MINT_SEED)),
// 		],
// 		program.programId,
// 	);
// 	const txn = await program.methods
// 		.initializeStorageAccount()
// 		.accounts({
// 			storageAccount: pda,
// 		})
// 		.rpc();
// });
const mint = Keypair.generate();
it("Is initialized!", async () => {
	
	// Add your test here.
	// const [mint, _] = await PublicKey.findProgramAddress(
	// 	[
	// 		wallet.publicKey.toBuffer(),
	// 		Buffer.from(anchor.utils.bytes.utf8.encode(CREATE_MINT_SEED)),
	// 	],
	// 	program.programId,
	// );

	const [pda, _] = await PublicKey.findProgramAddress(
		[
			wallet.publicKey.toBuffer(),
			Buffer.from(anchor.utils.bytes.utf8.encode(CREATE_MINT_SEED)),
		],
		program.programId,
	);

	// const mint = Keypair.generate();
	// console.log(mint.secretKey);
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
			.mint(testNftTitle, testNftSymbol, testNftUri, wallet.publicKey)
			.accounts({
				storageAccount: pda,
				masterEdition: masterEditionAddress,
				metadata: metadataAddress,
				mint: mint.publicKey,
				tokenAccount: tokenAddress,
				mintAuthority: wallet.publicKey,
				tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
			})
			.signers([mint])
			.rpc();
		}catch(e){
			console.log(e);

		};
	

});

it("Transfers NFTs", async () => {
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
});
});