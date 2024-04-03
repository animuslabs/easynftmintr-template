import { defineStore } from "pinia"
import { NameType, PermissionLevelType } from "@wharfkit/antelope"
import { reactive } from "vue"
import { link } from "../components/anchor"
import { nftmintcontract } from "../components/atomic"
import { Session } from "@wharfkit/session"
class LoggedInState {
  account:null | string = null
  auth:null | PermissionLevelType = null
  chainId:null | string = null
  wallet:null | NameType = null
}

export const useUser = defineStore({
  id: "User",
  state: () => (reactive({ loggedIn: new LoggedInState() })),
  getters: {
    getLoggedIn: (state) => {
      const t = state.loggedIn.account != null
      return t ? state.loggedIn : false
    }
  },
  actions: {
    setUser(session:Session | false) {
      console.log("set user", session)
      // this.loggedIn
      this.loggedIn.account = session ? session.actor.toString() : null
      this.loggedIn.auth = session ? session.permissionLevel : null
      this.loggedIn.chainId = session ? session.chain.id.toString() : null
      this.loggedIn.wallet = session ? session.walletPlugin.metadata.name || "anchor" : null
      console.log(this.loggedIn)
    },
    async transfer(quantity:string, memo:string, contract:string) {
      if (!this.loggedIn.account) {
        console.log("Not logged in")
        return
      }

      const from = this.loggedIn.account

      const actions = [{
        account: contract,
        name: "transfer",
        authorization: [{
          actor: from,
          permission: "active"
        }],
        data: {
          from,
          to: nftmintcontract,
          quantity,
          memo
        }
      }]

      const args = {
        actions,
        blocksBehind: 3, // Adjust according to your needs
        expireSeconds: 60 // Adjust according to your needs
      }

      const res = await link.transact(args)
      return res
    }
  }
})
