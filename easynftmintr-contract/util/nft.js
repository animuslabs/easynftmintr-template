const conf = require('./eosioConfig')
const env = require('./.env.js')
const { api, tapos, doAction, getFullTable } = require('./lib/eosjs')()
const activeChain = process.env.CHAIN || env.defaultChain
const defaultParams = { scope: conf.accountName[activeChain], code: conf.accountName[activeChain] }
const { serialize, deserialize, ObjectSchema } = require("atomicassets")
const defaultCollectionData = [
  { key: 'name', value: ['string', 'Meow testnet NFTS'] },
  { key: 'img', value: ['string', 'QmRHsBrP3NAHEKcaMhDWVSDNXn3jPbi8MMsmWDLYCTmtLY'] },
]
function valueToAttribute(val){
 if(typeof val === "string") return ['string', val]
  if(typeof val === "number") return ['int', val]
}
function dataToAttributes(nftData){
  return Object.entries(nftData).map(([key, value]) => {
    return {key, value: valueToAttribute(value)}
  })
}
const methods = {
  async transfer(from, to, asset, memo) {
    await doAction('transfer', {
      from,
      to,
      asset_ids: [asset],
      memo,
    }, 'atomicassets', from)
  },
  async transferMany(from, to, asset, memo) {
    await doAction('transfer', {
      from,
      to,
      asset_ids: [2199023260587, 2199023260588],
      memo,
    }, 'atomicassets', from)
  },
  async createCollection() {
    await doAction('createcol', {
      author: "meownfttest1",
      collection_name: 'meownfttest1',
      allow_notify: true,
      authorized_accounts: ["meownfttest1", "easynftmintr"],
      notify_accounts: [],
      market_fee: 0.1,
      data: defaultCollectionData,
    }, 'atomicassets', "meownfttest1", "active")
  },
  async setCollectionData() {
    await doAction('setcoldata', {
      collection_name: 'powerup.nfts',
      data: [
        { key: 'name', value: ['string', 'EOS PowerUp NFTs'] },
        { key: 'img', value: ['string', 'QmbncqcDy6pdNH6J7qTtdkmYrhyQ9BfaUwE4bbUPXURpE8'] },
        { key: 'description', value: ['string', 'NFTs created by eospowerup.io.'] },
        { key: 'url', value: ['string', 'https://eospowerup.io'] },
      ],
    }, 'atomicassets', defaultParams.code)
  },
  async createSchema() {
    await doAction('createschema', {
      authorized_creator: "meownfttest1",
      collection_name: 'meownfttest1',
      schema_name: 'meowmeow',
      schema_format: await require("./schemas.json")[0].format,
    }, 'atomicassets', "meownfttest1")
  },
  async createTemplate() {
    await doAction('createtempl', {
      authorized_creator: "ibc.nft.boid",
      collection_name: 'ibc.nft.boid',
      schema_name: 'thankyou',
      transferable: true,
      burnable: true,
      max_supply: 0,
      immutable_data: [
        { key: 'name', value: ['string', 'Boid Frontier Program Badge'] },
        { key: 'img', value: ['string', 'Qmbs5vkM6cjLd6rrcq1pGrJPLZb9ddr1aZcWoo9YsxcbMo'] },
        { key: 'description', value: ['string', 'Thank you for taking part in the Boid Frontier Program!'] },
        { key: 'link', value: ['string', 'frontier.boid.com'] },
      ],
    }, 'atomicassets', "ibc.nft.boid")
  },
  async createManyTemplates(){
    const templates = await require('./templates.json')
    for (const template of templates) {
      await doAction('createtempl', {
        authorized_creator: "meownfttest1",
        collection_name: 'meownfttest1',
        schema_name: 'meowmeow',
        transferable: true,
        burnable: true,
        max_supply: 100,
        immutable_data: dataToAttributes(template.immutable_data),
      }, 'atomicassets', "meownfttest1")
    }
  },
  async mint(template_id, new_asset_owner = "nft.boid") {
    await doAction('mintasset', {
      authorized_minter: defaultParams.code,
      collection_name: defaultParams.code,
      schema_name: 'avatarparts',
      template_id,
      new_asset_owner,
      immutable_data: [],
      mutable_data: [],
      tokens_to_back: [],
    }, 'atomicassets', defaultParams.code)
  },
  async mintRange(start, end) {
    start = parseInt(start)
    end = parseInt(end)
    if (isNaN(start) || isNaN(end) || start > end) throw (new Error("invlaid input"))
    const range = end - start
    for (let i = 0; i < range; i++) {
      await this.mint(start + i, "nft.boid")
    }
  },
  async burn(asset_owner, asset_id) {
    const data = {
      asset_owner,
      asset_id,
    }
    await doAction('burnasset', data, 'atomicassets', asset_owner)
  },
}


if (require.main == module) {
  if (Object.keys(methods).find(el => el === process.argv[2])) {
    console.log('Starting:', process.argv[2])
    methods[process.argv[2]](...process.argv.slice(3)).catch(error => console.error(error))
      .then(result => console.log('Finished'))
  } else {
    console.log('Available Commands:')
    console.log(JSON.stringify(Object.keys(methods), null, 2))
  }
}
module.exports = methods
