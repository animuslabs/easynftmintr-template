require("dotenv").config()
const { JsonRpc, Api } = require("eosjs")
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig")
const { TextDecoder, TextEncoder } = require("util")
// @ts-ignore
const conf = require("../eosioConfig")
// @ts-ignore
const env = require("../.env.js")
const activeChain = process.env.CHAIN || env.defaultChain
console.log("Active Chain:", activeChain)
const contractAccount = conf.accountName[activeChain]
const tapos = {
  blocksBehind: 20,
  expireSeconds: 60
}
let api
let rpc

const formatBloksTransaction = (network, txId) => {
  return ""
}
async function getFullTable({ code, scope, table }) {
  let limit = 100
  let results = []
  let lower_bound = ""
  const loop = async () => {
    const result = await api.rpc.get_table_rows({ code, scope, table, limit, lower_bound })
    for (const row of result.rows) results.push(row)
    if (result.more) {
      console.log(results.length)
      lower_bound = result.next_key
      return loop()
    }
  }
  await loop()
  return results
}
async function doAction(name, data, account, auth, permission = "active") {
  try {
    if (!data) data = {}
    if (!account) account = contractAccount
    if (!auth) auth = account
    console.log("Do Action:", name, data)
    const authorization = [{ actor: auth, permission }]
    const result = await api.transact({
      // "delay_sec": 0,
      actions: [{ account, name, data, authorization }]
    }, tapos)
    const txid = result.transaction_id
    console.log(result)
    console.log(formatBloksTransaction(activeChain, txid))
    console.log(result.processed.action_traces[0]?.console)
    return result
  } catch (error) {
    console.log("error")
    console.error(error)
    console.log(JSON.stringify(error, null, 2))
    console.error(error.toString())
    if (error.json) console.error("Logs:", error.json?.error?.details[1]?.message)
  }
}
function init(keys, apiurl) {
  if (!keys) keys = env.keys[activeChain]
  const signatureProvider = new JsSignatureProvider(keys)
  const fetch = require("node-fetch")

  if (!apiurl) apiurl = conf.endpoints[activeChain][0] || conf.endpoints[activeChain][1] || conf.endpoints[activeChain][2]
  console.log(apiurl)
  // @ts-ignore
  rpc = new JsonRpc(apiurl, { fetch })
  // @ts-ignore
  api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
  const authorization = [{ actor: contractAccount, permission: "active" }]
  return { api, rpc, tapos, doAction, formatBloksTransaction, getFullTable, authorization }
}

module.exports = init
