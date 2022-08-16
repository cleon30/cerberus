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

You will have to install 3 main things: Python Dependencies and Typescript dependencies.

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

## Installation of the IP Camera

Ok, this is a tricky part because the path to follow depends on the OS of your computer that you will use to run the Python. In my case I am using macOS in the computer + iPadOS in the IP Camera, and for that reason I am using a 3rd Party called EpocCam Pro, that you could find in the Apple Store. So, this path is actually your chocie. 

