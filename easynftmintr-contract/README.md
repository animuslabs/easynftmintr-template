
# EASYNFTMINTR
EASYNFTMINTR is a template for creating an NFT Minting site where users can pay with tokens to mint NFTs. This contract is responsible for holding a table of NFTs which can be minted as well as handling the minting of NFTs when token deposits are made.

## Build and Test
```bash
yarn
yarn build
yarn test
```

## Deploy
You can configure the account where you would like to deploy the contract. You can see the example contract deployed on Testnet [here](https://jungle4.cryptolions.io/v2/explore/account/easynftmintr). Deploy the contract by running the following command (update `config.js` and `.env` first):
```bash
yarn deploy [targetchainname]
```

## Setup Atomicassets Collection
You need to set up an atomicassets collection. On EOS, the easiest way is to use [atomichub.io](https://eos.atomichub.io/creator) and follow the instructions to set up a collection, schemas, and templates. When setting up the collection, ensure your contract account is listed as an authorized minter for the collection. For testnets where atomichub is not available or when you need additional control, this repository has scripts available inside the `./util` folder. Refer to the `README.md` in the util folder for more details.

## Initialize the Contract
You need to call the `templateset` action with the details of the collection/templates you just created. Refer to the tests folder for examples. You can use [bloks.io](https://bloks.io) or [cleos](https://github.com/AntelopeIO/cdt) to construct the transaction. You can also use the `do.js` script, which is documented in the `util` folder.

## Next Steps
Once you have the contract deployed and set up NFTs to be minted, you can connect the UI to it. Take a look at the UI template in this repository.
