const conf = require('./eosioConfig')
const env = require('./.env.js')
const { doAction } = require('./lib/eosjs')()
const collectionData = require('./collectionData.json')
const allSchemas = require('./schemas.json')
const allTemplates = require('./templates.json')
const activeChain = process.env.CHAIN || env.defaultChain
const defaultParams = { scope: conf.accountName[activeChain], code: conf.accountName[activeChain] }
const nftCollection = conf.collectionName[activeChain]
const collectionOwner = conf.collectionOwner[activeChain]
const mintContract = conf.accountName[activeChain]
const methods = {
  async createCollection(marketFee = 0.1) {
    await doAction('createcol', {
      author: collectionOwner,
      collection_name: nftCollection,
      allow_notify: true,
      authorized_accounts: [nftCollection, mintContract],
      notify_accounts: [],
      market_fee: marketFee,
      data: collectionData,
    }, 'atomicassets', collectionOwner)
  },
  async setCollectionData() {
    await doAction('setcoldata', {
      collection_name: nftCollection,
      data: collectionData
    }, 'atomicassets', collectionOwner)
  },
  async createSchemas() {
    for (const schema of allSchemas) {
      await doAction('createschema', {
        authorized_creator: collectionOwner,
        collection_name: nftCollection,
        schema_name: schema.schema_name,
        schema_format: schema.format,
      }, 'atomicassets', collectionOwner)
    }
  },
  async createTemplates() {
    for (const template of allTemplates) {
      await doAction('createtempl', {
        authorized_creator: collectionOwner,
        collection_name: nftCollection,
        schema_name: template.schema_name,
        transferable: template.transferable,
        burnable: template.burnable,
        max_supply: template.max_supply,
        immutable_data: dataToAttributes(template.immutable_data),
      }, 'atomicassets', collectionOwner)
    }
  }
}


function valueToAttribute(val) {
  if (typeof val === "string") return ['string', val]
  if (typeof val === "number") return ['int', val]
}
function dataToAttributes(nftData) {
  return Object.entries(nftData).map(([key, value]) => {
    return { key, value: valueToAttribute(value) }
  })
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
