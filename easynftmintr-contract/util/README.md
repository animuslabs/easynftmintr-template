
## Overview
This folder contains scripts for setting up and managing the NFTs and the easynfymintr contract.

### Dependencies
cd into this directory `cd util` and run yarn or npm install to install the util dependencies.

## Configuration
Make sure that the `eosioConfig.js` and `.env.js` files are correctly set up with your blockchain and contract details. To setup `.env.js` copy `example.env.js` as an example. Add your keys for the NFT issuer account and also for the account where the easynftmintr contract is deployed. The scripts read the `CHAIN` env var to determine what the target chain is, or uses the defaultChain configured in eosioConfig.
```
export CHAIN=jungle
```

# do.js
`do.js` can be executed from the command line and includes several methods that can be invoked with specific arguments to control the `easynftmintr` contract.

### Available Methods
- `templateset <collection_name> <schema_name> <template_id> <contract> <quantity>`
  - Sets a new template with the specified details for the `easynftmintr` contract to be able to mint NFTs for the configured price.
- `templaterm <template_id>`
  - Removes a template fromt the `easynftmintr` contract based on the template ID.
- `templateSetAll <contract> <quantity>`
  - Applies the `templateset` operation to all templates within the target collection. You can use this to quickly register all NFTs in a collection with the `easynftmintr` contract.


## Examples
Run a command by calling `do.js` with the desired method and arguments:
```bash
node do.js templateset "mycollection" "myschema" 123 "eosio.token" "1.0000 SYS"
```
To set all templates in a collection to a specific price and contract:
```bash
node do.js templateSetAll "eosio.token" "1.0000 SYS"
```

# nft.js
`nft.js` is a utility script for creating and managing collections, schemas, and templates for NFTs using the atomicassets standard. The script reads data from the `eosioConfig.js` file as well as `schemas.json`, `templates.json`, and `collectionMeta.json` to create and update NFT collections. You can manually modify the .json files to customize the NFTs that are created. You can also run the `loadNftData.js` script to automatically populate schemas and templates based on data from an existing collection (whatever `collectionName` is set in `eosioConfig` will be loaded from the target chain).

### Available Methods
- `createCollection`
  - Creates a new NFT collection with specified details like market fee, allowed notifications, and authorized accounts. You can optionally provide a custom fee when calling this method.
- `setCollectionData`
  - Updates data for an existing NFT collection. Only needed if you want to change the collection metadata after the collection has been created.
- `createSchemas`
  - Creates schemas within a collection based on predefined settings in `schemas.json`.
- `createTemplates`
  - Creates templates within a schema, setting attributes like transferability, burnability, and max supply.

### Running Commands
To setup an NFT collection from scratch you would run these commands. Make sure the .json files mentioned above are properly configured before running these commands.
```bash
node nft.js createCollection 0.1
node nft.js createSchemas
node nft.js createTemplates
```
