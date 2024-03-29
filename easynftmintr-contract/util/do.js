
const conf = require("./eosioConfig")
const env = require("./.env.js")
const { api, tapos, doAction } = require("./lib/eosjs")()
const activeChain = process.env.CHAIN || env.defaultChain
const contractAccount = conf.accountName[activeChain]
const collection_name = "meownfttest1"

const methods = {
  async templateset(){
      await doAction("templateset",{
      nft: {
        template_id: 1,
        price: {
          contract: "eosio.token",
          quantity: "1.0000 TLOS"
        },
        schema_name: "testschema",
        collection_name: "nftissuer",
      }
    })
  },
  async templaterm(template_id){
    await doAction("templaterm",{
      template_id
    })

  },
  async templateSetAll(){
    const allTemplates = await api.rpc.get_table_rows({
      code: "atomicassets",
      scope: collection_name,
      table: "templates",
    })
    for (const template of allTemplates.rows) {
      await doAction("templateset",{
      nft: {
        template_id: template.template_id,
        price: {
          contract: "eosio.token",
          quantity: "0.1000 TLOS"
        },
        schema_name: template.schema_name,
        collection_name,
      }
    })
    }
  }

}
if (require.main == module) {
  if (Object.keys(methods).find(el => el === process.argv[2])) {
    console.log("Starting:", process.argv[2])
    methods[process.argv[2]](...process.argv.slice(3)).catch(error => console.error(error))
      .then(result => console.log("Finished"))
  } else {

    console.log("Available Commands:")
    console.log(JSON.stringify(Object.keys(methods), null, 2))
  }
}
module.exports = methods
