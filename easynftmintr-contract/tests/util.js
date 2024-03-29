const { Name } = require("@greymass/eosio")
const { Blockchain } = require("@proton/vert")

const chain = new Blockchain()
const contract = chain.createContract('contract', './build/contract')
const token = chain.createContract("token", "./external/token")
const token2 = chain.createContract("token2", "./external/token")
const atomicassets = chain.createContract("atomicassets", "./external/atomicassets")

chain.createAccounts('alice', 'bob')


function logActions() {
  console.log(chain.actionTraces.map(el => [el.action.toString(), JSON.stringify(el.decodedData, null, 2)]))
}
const con = (actionName, params, auth) => contract.actions[actionName](params || {}).send(auth || "contract@active")
const aa = (actionName, params, auth) => atomicassets.actions[actionName](params || {}).send(auth || "atomicassets@active")
const tkn = (actionName, params, auth) => token.actions[actionName](params || {}).send(auth || "token@active")
const tkn2 = (actionName, params, auth) => token2.actions[actionName](params || {}).send(auth || "token2@active")

async function init() {
  await setupNfts()
  await setupToken()
}

async function setupToken() {
  await tkn("create", {
    issuer: "token",
    maximum_supply: "100 TST"
  })
  await tkn("issue", {
    to: "token",
    quantity: "100 TST",
    memo: ""
  })
  await tkn2("create", {
    issuer: "token2",
    maximum_supply: "100 TST"
  })
  await tkn2("issue", {
    to: "token2",
    quantity: "100 TST",
    memo: ""
  })

}

async function setupNfts() {
  chain.createAccount("nftissuer")
  await aa("init")
  await aa("createcol", {
    author: "nftissuer",
    collection_name: "nftissuer",
    allow_notify: true,
    authorized_accounts: ["nftissuer","contract"],
    notify_accounts: ["nftissuer"],
    market_fee: "0.05",
    data: []
  }, "nftissuer")
  await aa("createschema", {
    authorized_creator: "nftissuer",
    collection_name: "nftissuer",
    schema_name: "testschema",
    schema_format: [{ name: "name", type: "string" }]
  }, "nftissuer")

  await aa("createtempl", {
    authorized_creator: "nftissuer",
    collection_name: "nftissuer",
    schema_name: "testschema",
    transferable: true,
    burnable: true,
    max_supply: 100,
    immutable_data: [{ key: 'name', value: ['string', 'Test NFT'] }],
  }, "nftissuer")


  await aa("mintasset", {
    authorized_minter: "nftissuer",
    collection_name: "nftissuer",
    schema_name: "testschema",
    template_id: 1,
    new_asset_owner: "nftissuer",
    immutable_data: [],
    mutable_data: [],
    tokens_to_back: []
  }, "nftissuer")
}

function nftInventory(scope) {
  scope = Name.from(scope).value.toString()
  return atomicassets.tables.assets(scope).getTableRows()
}

function nfts() {
  return contract.tables.nfts().getTableRows()
}

function tknBal(account) {
  return parseInt(token.tables.accounts(Name.from(account).value.toString()).getTableRows()[0].balance)
}

const nftConfig = {
      nft: {
        template_id: 1,
        price: {
          contract: "token",
          quantity: "2 TST"
        },
        schema_name: "testschema",
        collection_name: "nftissuer",
      }
    }


module.exports = { chain, con, aa, tkn, logActions, init, nftInventory, nfts, contract, tknBal,nftConfig ,tkn2}

