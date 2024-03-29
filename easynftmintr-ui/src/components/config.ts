export const appname = "testnfttemplate"
export interface NetworkConfig {
  name:string
  chainId:string
  nodeUrl:string
  logo:string
}

export const endpoints:string[][] = [
  ["EOS Endpoint", "https://eos.api.animus.is"],
  ["Telos Endpoint", "https://telos.api.animus.is"],
  ["Telos Testnet Endpoint", "https://telos.testnet.boid.animus.is"],
  ["IPFS Endpoint", "https://ipfs.animus.is/ipfs/"], // 3
  ["EOS AtomicAssets", "https://eos.api.atomicassets.io"], // 4
  ["WAX AtomicAssets", "https://wax.eu.eosamsterdam.net"], // 5
  ["EOS AtomicHub", "https://eos.atomichub.io/explorer/asset/"], // 6
  ["EOS AtomicHub Templates", "https://eos.atomichub.io/explorer/template/"], // 7
  ["Nefty blocks Telos Testnet Assets", "https://telos-test.neftyblocks.com/assets/"], // 8
  ["Nefty blocks Telos Testnet Templates", "https://telos-test.neftyblocks.com/templates/"], // 9
  ["Nefty blocks Telos Assets", "https://telos.neftyblocks.com/assets/"], // 10
  ["Nefty blocks Telos Templates", "https://telos.neftyblocks.com/templates/"] // 11
]
export const networks:NetworkConfig[] = [
  // default network should be first!!!
  // {
  //   name: "eos",
  //   chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  //   nodeUrl: endpoints[0][1],
  //   logo: "https://bloks.io/img/chains/eos.png"
  // }
  // {
  //   name: "telos",
  //   chainId: "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11",
  //   nodeUrl: endpoints[1][1],
  //   logo: "https://assets-global.website-files.com/60ae1fd65f7b76f18ddd0bec/61044a5f70f5bbeb24b995ea_Symbol%202%402x.png"
  // }
  {
    name: "telostestnet",
    chainId: "1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f",
    nodeUrl: "https://telos.testnet.boid.animus.is",
    logo: "https://assets-global.website-files.com/60ae1fd65f7b76f18ddd0bec/61044a5f70f5bbeb24b995ea_Symbol%202%402x.png"
  }
  // {
  //   name: 'waxtestnet',
  //   chainId: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
  //   nodeUrl: 'https://testnet.wax.pink.gg',
  //   logo: 'https://bloks.io/img/chains/wax.png',
  //   contracts: { avatarmk: Name.from('waxcontract1') },
  //   atomicMarket: 'https://wax-test.atomichub.io'
  //   atomicMarketApi: 'https://test.wax.api.atomicassets.io'
  // }
]

export function getNetworkByChainId(chainId:string):NetworkConfig {
  return networks.find((n) => n.chainId === chainId) || networks[0]
}
export function activeNetwork():NetworkConfig {
  return networks[0]
}
