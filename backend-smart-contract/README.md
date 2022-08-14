<div align="center">
  <h1>
    <code>Solana Whitelisting PDA contract</code>
  </h1>

  
  <sub>
    Built in Solana using Anchor and 🦀  <a href="https://solana.com/es" target="_blank">Solana</a>
    
  </sub>
  
</div>

## Description

The Solana Whitelisting PDA contract is an open-source tool for developers in the Solana ecosystem, enabling them to create an on-chain whitelisting solution as easier as possible. 

## Setting up your Localnet

Set your config to localhost
```bash
solana config set --url localhost
```
Then run in separate window
```bash
solana-test-validator --reset
````
Also you can view all the program interactions with:
```bash
solana logs
```

## Installing Project & Dependencies 

Set your config to localhost
```bash
git clone https://github.com/cleon30/solana-labs-PDA-Whitelisting.git
cd solana-labs-PDA-Whitelisting.git
yarn add ts-mocha
```
Also if you don't have Anchor or npm or Solana, please follow these instructions: https://project-serum.github.io/anchor/getting-started/installation.html

## Running


Take in consideration that I assume that you are running a local validator, if not follow localnet commands

All in instruction:
```bash
solana airdrop 10 ~/.config/solana/id.json && clear && anchor build && clear && anchor deploy && clear && anchor run counter
```

Step by step:

To build the smart contract programs:
```bash
anchor build
```
To have money to deploy
```bash
solana airdrop 10 ~/.config/solana/id.json
```
To deploy the smart contract to Blockchain
```bash
anchor deploy
```
To run the Counter testing
```bash
anchor run counter
```

0xCleon