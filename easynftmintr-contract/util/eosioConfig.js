module.exports = {
  chains: ['eos', 'kylin', 'jungle', ],
  endpoints: {

    eos: ['https://eos.eosn.io', 'https://eos.api.animus.is', 'https://eos.dfuse.eosnation.io/'],
    kylin: ['https://kylin.eosn.io', 'https://kylin.eossweden.org'],
    jungle: ['https://jungle4.cryptolions.io:443'],
  },
  accountName: {
    jungle: "easynftmintr",
  },
  explorer: {
    jungle:"https://local.bloks.io/?nodeUrl=http%3A%2F%2Fjungle4.cryptolions.io&systemDomain=eosio&hyperionUrl=https%3A%2F%2Fjungle4history.cryptolions.io"
  },
  contractName: 'contract'
}
