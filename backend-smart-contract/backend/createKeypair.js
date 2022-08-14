const fs = require('fs')
const anchor = require('@project-serum/anchor')

const account = anchor.web3.Keypair.generate();
const account_whitelist = anchor.web3.Keypair.generate();
fs.writeFileSync('../keypair.json', JSON.stringify(account))
fs.writeFileSync('../keypair_whitelist.json', JSON.stringify(account_whitelist))