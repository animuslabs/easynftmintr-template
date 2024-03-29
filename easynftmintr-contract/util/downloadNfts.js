const conf = require("./eosioConfig")
const env = require("./.env.js")
const { api, tapos, doAction } = require("./lib/eosjs")()
const activeChain = process.env.CHAIN || env.defaultChain
const contractAccount = conf.accountName[activeChain]
const fs = require('node:fs');
const {serialize, deserialize, ObjectSchema} = require("atomicassets")

async function main(){
  const schemas = await api.rpc.get_table_rows({
  code: "atomicassets",
  scope: "nft.meow",
  table: "schemas",
  limit:10
})
console.log(schemas)
fs.writeFileSync("schemas.json", JSON.stringify(schemas.rows, null, 2))

const templates = await api.rpc.get_table_rows({
  code: "atomicassets",
  scope: "nft.meow",
  table: "templates",
  json: true,
  limit:10
})
const deserialized = templates.rows.map(row => {
  console.log(row)
  const schema = schemas.rows.find(schema => schema.schema_name === row.schema_name)
  console.log(schema)
  const deserialized = deserialize( row.immutable_serialized_data,ObjectSchema(schema.format))
  delete row.immutable_serialized_data
  row.immutable_data = deserialized
  return row
})
fs.writeFileSync("templates.json", JSON.stringify(deserialized, null, 2))
}



main()
