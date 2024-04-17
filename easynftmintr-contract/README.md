# EASYNFTMINTR
EASYNFTMINTR is a template for creating an NFT Minting site where users can pay with tokens to mint NFTs. This is the contract wich is responsible for holding a table of NFTs which can be minted as well handling the minting of NFTs when token deposits are made.

## Build and Test
```bash
yarn
yarn build
yarn test
```

## Deploy
You can configure the acount where you would like to deploy the contract. You can see the example contract deployed on Testnet [here](https://jungle4.cryptolions.io/v2/explore/account/easynftmintr). You can deploy the contract by running the following command (update fuckyeah.config.js and .env first)
```bash
yarn deploy [targetchainname]
```
## Setup Atomicassets collection
You need to setup an atomicassets collection. The easiest way is to use [atomichub.io](https://eos.atomichub.io/creator) and follow the instructions to setup a collection, schemas, templates. When you setup the collection, make sure your contract account is listed as an authorized minter for the collection.

## Initialize the contract
you need to call the `templateset` action with the details of the collection/templates you just created. Refer to the tests folder for examples. You can use [bloks.io](https://bloks.io) or [cleos](https://github.com/AntelopeIO/cdt) to construct the transaction.

## Next Steps
Once you have the contract deployed and setup NFTs to be minted you can connect the UI to it. Take a look at the UI template in this repo.

