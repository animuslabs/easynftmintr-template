import { defineStore } from "pinia"
import { LinkSession, NameType, PermissionLevelType } from "anchor-link"
import { reactive } from "vue"
import { link } from "../components/anchor"
import { nftmintcontract } from "../components/atomic"
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
    setUser(session:LinkSession | false) {
      console.log("set user", session)
      // this.loggedIn
      this.loggedIn.account = session ? session.auth.actor.toString() : null
      this.loggedIn.auth = session ? session.auth : null
      this.loggedIn.chainId = session ? session.chainId.toString() : null
      this.loggedIn.wallet = session ? session.metadata.name : null
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
