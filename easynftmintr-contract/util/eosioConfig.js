module.exports = {
  chains: ['eos', 'kylin', 'wax', 'jungle', 'telosTest', 'waxTest'],
  endpoints: {
    telos: ['https://telos.api.animus.is'],
    eos: ['https://eos.eosn.io', 'https://eos.api.animus.is', 'https://eos.dfuse.eosnation.io/'],
    kylin: ['https://kylin.eosn.io', 'https://kylin.eossweden.org'],
    jungle: ['https://jungle4.cryptolions.io:443'],
    telosTest: ['https://testnet.telos.caleos.io'],
    waxTest: ['https://testnet.waxsweden.org']
  },
  accountName: {
    telosTest: "easynftmintr",
    jungle: "easynftmintr",
  },
  explorer: {
    waxTest: "https://wax-test.bloks.io",
    telosTest: "https://explorer-test.telos.net",
    telos: "https://explorer.telos.net",
    jungle:"https://local.bloks.io/?nodeUrl=http%3A%2F%2Fjungle4.cryptolions.io&systemDomain=eosio&hyperionUrl=https%3A%2F%2Fjungle4history.cryptolions.io"
  },
  contractName: 'contract'
}
