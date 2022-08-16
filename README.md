<div align="center">
  <h1>
    <code>Cerberus project</code>
  </h1>

  
   <sub>
    Built in Solana using 🦀 , 🐍 , Typescript and  Anchor 
     
  </sub>
  
</div>

## **Presentation**
 
 https://docs.google.com/presentation/d/1CkDXqZk6Zq4Kv-Zl4Fc95QZmIXMTUyuMwI_C0Uk6yTo/edit?usp=sharing
 
## **Introduction**

Cerberus is an on-chain solution to improve web3 IRL experience

## **Value Proposition**

IRL Blockchain events have an important role in the crypto space, and right now they are in a very early stage, usually lacking of on-chain tangible experience. 

In the upcoming years, mobile web3 phones will probably be our straight path to that experience. Because of that, we must start building for them.
 
## Purpose

Cerberus has been designed to improve the user experience on events, being a perfect way to bring web3 in a more tangible way.

Also, this project is aiming to normalize the use of crypto in the society, being a good way to feel crypto more tangible than ever.

# Project Description

## Project Description (I)

At the entrance of the event there will be an IP Camera transmitting video to our local computer through WiFi.

These frames will be analyzed using Deep Learning , aiming to detect QR codes from wallets and decoding them to obtain the wallet PublicKey.


<img width="688" alt="image" src="https://user-images.githubusercontent.com/62452212/184906570-0a33083b-e107-4565-849d-b654d7849594.png">

## Project Description (II)

Once obtained the wallet, our backend will immediately whitelist this PublicKey on our Whitelisting Contract in Solana Blockchain.

This Whitelisting Contract is an on-chain program, designed to store wallets using PDAs.  Also, a counter will be integrated in another program to know the number of wallets stored.

Everything with Smart Contracts.


<img width="120" alt="Captura de Pantalla 2022-08-16 a las 16 25 31" src="https://user-images.githubusercontent.com/62452212/184904471-2bc3ad9a-3c1c-4e9f-b179-14c4ede59c15.png">.         <img width="250" alt="PDAs" src="https://user-images.githubusercontent.com/62452212/184901630-a14401d6-aff6-4587-8ed1-6c9847ef458c.png">

## Project Description (III)

Once the wallet is whitelisted, we will have the option to instantly send NFTs to this user, so he/she could be able to redeem these NFTs inside the event.


<img width="800" alt="image" src="https://user-images.githubusercontent.com/62452212/184901930-c50deae1-de14-4a01-870c-d9d728521e07.png">

## **Video Demo**

[![Watch the video](https://raw.githubusercontent.com/cleon30/cerberus/main/NFTs_json/images/video.png)](https://www.youtube.com/watch?v=tE3eFMNeNOg)

https://www.youtube.com/watch?v=tE3eFMNeNOg

## Installation

You will have to install 3 main things: Python Dependencies, Typescript dependencies and Anchor + Solana.

### Python Dependencies

```bash
cd QR-python-API-darknet
pip3 install opencv-python pyzbar pandas tempfile json numpy
```
### Python Server Dependencies

```bash
cd server-FastApi
pip3 install fastapi
```
### Typescript dependencies

```bash
cd backend-smart-contract
npm i
```

### Anchor & Solana

To install Solana and Anchor follow this URL : https://book.anchor-lang.com/getting_started/installation.html


## Installation of the IP Camera

Ok, this is a tricky part because the path to follow depends on the OS of your computer that you will use to run the Python. In my case I am using macOS in the computer + iPadOS in the IP Camera, and for that reason I am using a 3rd Party called EpocCam Pro, that you could find in the Apple Store. 


## Building and deploying the App 

You will need Solana and Anchor installed. Also, make sure you have more than 10.5 SOL in the wallet or it will fail.

In order to get the 10 SOL just run ```solana airdrop 2 ~/.config/solana/id.json``` 5 times until you get them.

Having completed that, please execute this to build and deploy the anchor program:
```bash
anchor build 
anchor deploy
```

## Running 

After you have installed all the dependencies, you are ready to run all the process.

You will be running the entire process in 3 shells: Python AI QR Scan + Python server + Typescript Backend.

### Running Python AI QR Scan

Considering that you already have EpocCam Pro/"Your IP App" ready, you only will need to execute in the shell:
```bash
cd QR-python-API-darknet && python3 main.py
```

### Running the Python Server

```bash
cd server-FastApi && uvicorn main:app --reload
```

### Running the Typescript Backend 

Before running the backend, please make sure the "../keypair.json" and "../keypair_whitelist.json" are actually the Keypairs you want to store the info.
I created a Javascript script to generate them in case you want to get new ones.  Just running:```node createKeypair.js``` inside the backend folder.

Completed the Keypair step, you are ready to run the backend!

Running the backend:
```bash
anchor run backend
```

## Tests

For testing the Smart Contracts I have used multiple cases, with different parameters and situations when calling the functions.
In the project you will find 3 tests inside the test directory. You will be able to run all them with ```anchor run test``` . 

### Testing the Whitelist

```bash
anchor run whitelist
```
<img width="505" alt="image" src="https://user-images.githubusercontent.com/62452212/184933813-ee4095dd-be8b-42c5-9f2c-e86e64b284b8.png">

### Testing the Counter

```bash
anchor run counter
```
<img width="679" alt="image" src="https://user-images.githubusercontent.com/62452212/184934015-816a72fc-fb2f-497f-8091-fc0307a29f80.png">

### Testing the Minter

```bash
anchor run minter
```

<img width="565" alt="image" src="https://user-images.githubusercontent.com/62452212/184934341-d421fcc3-a226-4c47-b422-8bd7d373d774.png">
<img width="1232" alt="image" src="https://user-images.githubusercontent.com/62452212/184934744-226705cd-5ef5-4893-b758-716b7eeb900b.png">

