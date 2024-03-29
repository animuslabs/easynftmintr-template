const conf = require("./eosioConfig.js")
const env = require("./.env.js")
const { api, tapos, doAction } = require("./lib/eosjs.js")()
const activeChain = process.env.CHAIN || env.defaultChain
const contractAccount = conf.accountName[activeChain]
// const contractAccount = "tknmint.boid"
const methods = {
  async stake() {
    const data = {
      from: contractAccount,
      receiver: contractAccount,
      stake_net_quantity: "1.0000 TLOS",
      stake_cpu_quantity: "5.0000 TLOS",
      transfer: false,
    }
    const act = {
      account: "eosio",
      name: "delegatebw",
      data,
      authorization: [{
        actor: contractAccount,
        permission: "active"
      }]
    }
    const result = await api.transact({ actions: [act] }, tapos)
    console.log(result.transaction_id, "result.transaction_id")
  },
  async buyRam() {
    const act = {
      account: "eosio",
      name: "buyrambytes",
      data: {
        payer: contractAccount,
        receiver: contractAccount,
        bytes: 100000
      },
      authorization: [
        {
          actor: contractAccount,
          permission: "active"
        }
      ]
    }
    // await doAction("updateauth", { account: "stake.boid", auth, parent: "owner", permission: "active" }, "eosio", contractAccount)
    const result = await api.transact({ actions: [act] }, tapos)
    console.log(result.transaction_id, "result.transaction_id")
  },
  async boidActive() {
    const auth = {
      threshold: 1,
      keys: [],
      accounts: [{ permission: { actor: "boid", permission: "eosio.code" }, weight: 1 }, { permission: { actor: "dac.boid", permission: "active" }, weight: 1 }],
      waits: []
    }
    // await doAction("updateauth", { account: "burn.boid", auth, parent: "owner", permission: "active" }, "eosio", "burn.boid", "owner")
    await doAction("updateauth", { account: "boid", auth, parent: "owner", permission: "active" }, "eosio", "boid", "active",)
  },
  async tknMint() {
    const auth = {
      threshold: 1,
      keys: [],
      accounts: [{ permission: { actor: "dac.boid", permission: "active" }, weight: 1 }],
      waits: []
    }
    // await doAction("updateauth", { account: "burn.boid", auth, parent: "owner", permission: "active" }, "eosio", "burn.boid", "owner")
    await doAction("updateauth", { account: "tknmint.boid", auth, parent: "", permission: "owner" }, "eosio", "tknmint.boid", "owner",)
  },
  async stakeBoid() {
    const auth = {
      threshold: 1,
      keys: [],
      accounts: [{ permission: { actor: "dac.boid", permission: "active" }, weight: 1 }],
      waits: []
    }
    // await doAction("updateauth", { account: "burn.boid", auth, parent: "owner", permission: "active" }, "eosio", "burn.boid", "owner")
    await doAction("updateauth", { account: "stake.boid", auth, parent: "", permission: "owner" }, "eosio", "stake.boid", "owner",)
  },
  async nullBurnAcct() {
    const auth = {
      threshold: 1,
      keys: [],
      accounts: [{ permission: { actor: "eosio.null", permission: "owner" }, weight: 1 }],
      waits: []
    }
    // await doAction("updateauth", { account: "burn.boid", auth, parent: "owner", permission: "active" }, "eosio", "burn.boid", "owner")
    await doAction("updateauth", { account: "burn.boid", auth, parent: "", permission: "owner" }, "eosio", "burn.boid", "owner",)
  },
  async updateauthStakeActive() {
    const auth = {
      threshold: 1,
      keys: [],
      accounts: [{ permission: { actor: contractAccount, permission: "eosio.code" }, weight: 1 }],
      waits: []
    }
    await doAction("updateauth", { account: "stake.boid", auth, parent: "owner", permission: "active" }, "eosio", "stake.boid")
  },
  async updateauthTknMintActive() {
    const auth = {
      threshold: 1,
      keys: [],
      accounts: [{ permission: { actor: contractAccount, permission: "eosio.code" }, weight: 1 }],
      waits: []
    }
    await doAction("updateauth", { account: "tknmint.boid", auth, parent: "owner", permission: "active" }, "eosio", "tknmint.boid")
  },
  async updateauth() {
    const auth = {
      threshold: 1,
      keys: [{ key: "EOS6MBs7WoFXL4GC8aLR7icFAdoqiNfxWHz4pPnhYLfCfB68EWzCq", weight: 1 }],
      accounts: [{ permission: { actor: contractAccount, permission: "eosio.code" }, weight: 1 }],
      waits: []
    }
    await doAction("updateauth", { account: contractAccount, auth, parent: "owner", permission: "active" }, "eosio", contractAccount)
  },
  async makeChildAccount(targetAccount) {
    const auth = {
      threshold: 1,
      keys: [{ key: "EOS6btgH2bErDfBVaEnd2NG117yAsaf6KaJohACB9tXedN5cgHhg9", weight: 1 }],
      accounts: [{ permission: { actor: contractAccount, permission: "eosio.code" }, weight: 1 }],
      waits: []
    }
    await doAction("updateauth", { account: targetAccount, auth, parent: "owner", permission: "active" }, "eosio", targetAccount)
  },
  async createAccount(accountName) {
    const result = await api.transact({
      actions: [{
        account: "eosio",
        name: "newaccount",
        data: {
          creator: "boid",
          name: accountName,
          owner: {
            threshold: 1,
            keys: [
            ],
            accounts: [
              {
                permission: { actor: "dac.boid", permission: "active" },
                weight: 1
              }
            ],
            waits: []
          },
          active: {
            threshold: 1,
            keys: [
              {
                key: "EOS6MBs7WoFXL4GC8aLR7icFAdoqiNfxWHz4pPnhYLfCfB68EWzCq",
                weight: 1
              }
            ],
            accounts: [],
            waits: []
          }
        },
        authorization: [
          {
            actor: contractAccount,
            permission: "active"
          }
        ]
      },
      {
        account: "eosio",
        name: "buyrambytes",
        data: {
          payer: "boid",
          receiver: accountName,
          bytes: 10000
        },
        authorization: [
          {
            actor: "boid",
            permission: "active"
          }
        ]
      },
      {
        account: "eosio",
        name: "delegatebw",
        data: {
          from: contractAccount,
          receiver: accountName,
          stake_net_quantity: "0.2000 TLOS",
          stake_cpu_quantity: "1.2000 TLOS",
          transfer: true
        },
        authorization: [
          {
            actor: contractAccount,
            permission: "active"
          }
        ]
      }]
    }, tapos)
    console.log(result)
  }
}

if (require.main == module) {
  if (Object.keys(methods).find(el => el === process.argv[2])) {
    console.log("Starting:", process.argv[2])
    methods[process.argv[2]](...process.argv.slice(3)).catch((error) => console.error(error))
      .then((result) => console.log("Finished"))
  } else {
    console.log("Available Commands:")
    console.log(JSON.stringify(Object.keys(methods), null, 2))
  }
}
module.exports = methods
