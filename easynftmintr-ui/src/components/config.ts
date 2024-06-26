import { ChainDefinitionType } from "@wharfkit/session"

export const appname = "testnfttemplate"
export interface NetworkConfig {
  name:string
  chainId:string
  nodeUrl:string
  logo:string
}

export const endpoints:string[][] = [
  ["EOS Endpoint", "https://eos.api.animus.is"],
  ["", ""],
  ["", ""],
  ["IPFS Endpoint", "https://ipfs.animus.is/ipfs/"], // 3
  ["EOS AtomicAssets", "https://eos.api.atomicassets.io"], // 4
  ["", ""], // 5
  ["EOS AtomicHub", "https://eos.atomichub.io/explorer/asset/"], // 6
  ["EOS AtomicHub Templates", "https://eos.atomichub.io/explorer/template/"], // 7
  ["", ""], // 8
  ["", ""], // 9
  ["", ""], // 10
  ["", ""], // 11
  ["Jungle Endpoint", "https://jungle4.cryptolions.io"] // 12
]
export const networks:ChainDefinitionType[] = [
  {
    name: "jungletestnet",
    id: "73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d",
    url: "https://jungle4.cryptolions.io",
    logo: "/junglelogo.png"
  }
]

export function getNetworkByChainId(chainId:string):ChainDefinitionType {
  return networks.find((n) => n.id === chainId) || networks[0]
}
export function activeNetwork():ChainDefinitionType {
  return networks[0]
}
