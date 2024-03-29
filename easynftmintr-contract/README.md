# EASYNFTMINTR
EASYNFTMINTR is a template for creating an NFT Minting site where users can pay with tokens to mint NFTs. This is the contract wich also connects to the minting smart contract.

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

## Util
The util directory include some convenience scripts, These scripts are useful if you prefer not to use cleos. To use the scripts you must create .env.js file in the util folder with your private key and possibly update eosioConfig.js

### do.js
For doing basic actions related to the easynftmintr contract. Feel free to modify with commonly needed actions.
#### example
```bash
cd ./util
CHAIN=jungle node do templateset
CHAIN=jungle node do templaterm 2
```
When the contract is deployed you need to register NFTs to be minted, the mint contract needs to be listed in the authorized_accounts array on the atomicassets nft collection. Register each template by calling the `tempalteset` action with the relevant details.

### downloadNfts.js
For testing you may want to copy an existing NFT collection for use in your project, this script copies NFT collection data into schemas.json and tempaltes.json for use in other scripts

### nft.js
You can uses these methods to setup your NFT collection/schemas, you will need to manually update the methods with your specific collection details
#### example
```bash
cd ./util
CHAIN=jungle node nft createSchema
```

### setup.js
This script contains various utility functions for managing account authentication and resources.
#### example
```bash
cd ./util
CHAIN=jungle node setup buyRam
```

## Next Steps
Once you have the contract deployed and setup NFTs to be minted you can connect the UI to it. Take a look at the UI template in this repo.

