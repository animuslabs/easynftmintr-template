import { LocalStorage } from "quasar"
import { APIClient, Checksum256Type, PermissionLevel } from "@wharfkit/antelope"
import { useUser } from "src/stores/anchorstore"
import { networks, appname, endpoints } from "src/components/config"
import { ChainId, Session, SessionKit, TransactArgs } from "@wharfkit/session"
import { WebRenderer } from "@wharfkit/web-renderer"
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor"
import { toObject } from "src/components/lib"

const client = new APIClient({ url: endpoints[12][1] })
const webRenderer = new WebRenderer()

// const session:LinkChannelSession = {}
export interface StoredSession {
  auth:{actor:string, permission:string},
  chainId:string
}
class LinkManager {
  store:typeof useUser
  appname = appname
  transport = new WalletPluginAnchor()
  client!:APIClient
  rpc!:typeof client.v1.chain
  sessionKit = new SessionKit({
    appName: this.appname,
    walletPlugins: [this.transport],
    chains: networks,
    ui: webRenderer
  })

  session:Session|null = null

  constructor(usrStore:typeof useUser) {
    this.store = usrStore
    this.try_restore_session()
  }

  setApi(client:APIClient) {
    this.client = client
    this.rpc = client.v1.chain
  }

  async transact(args:TransactArgs) {
    if (this.session === null) return console.log("no session, login first")
    const res = await this.session.transact(args)
    return res
  }

  async login() {
    const identity = await this.sessionKit.login()
    if (identity) {
      const { session } = identity
      this.session = session
      this.setApi(this.session.client)
      this.try_restore_session()
      console.log(toObject({ actor: session.actor, acct: session.account }))
    }
  }

  async logout() {
    if (this.session) {
      this.sessionKit.logout()
      this.setApi(this.session.client)
      this.session = null
      this.store().setUser(false)
      // this.try_restore_session()
    } else {
      console.log("you can't logout if there is no active session")
    }
  }

  async deleteSession(permissionlevel:PermissionLevel, chainId:ChainId):Promise<void> {
    console.error("deleteSession not implemented")
    // if (!this.session) return this.session.removeSession(this.appname, permissionlevel, chainId)
    // console.log(this.session.auth.equals(permissionlevel))
    // console.log(this.session.chainId.equals(chainId))
    // if (this.session.auth.equals(permissionlevel) && this.session.chainId.equals(chainId)) {
    //   console.log("current session")
    //   this.logout()
    // } else {
    //   await this.session.removeSession(this.appname, permissionlevel, chainId)
    // }
  }

  async restore_session(permissionlevel:PermissionLevel, chainId:Checksum256Type):Promise<void> {
    const session = await this.sessionKit.restore(
      {
        chain: chainId,
        permission: permissionlevel.permission,
        actor: permissionlevel.actor
      }
    )
    if (session) {
      this.session = session
      this.setApi(this.session.client)
      this.store().setUser(session)
    }
  }

  async try_restore_session():Promise<false | Session> {
    const session = await this.sessionKit.restore()
    if (session) {
      console.log(
        `${session.chain.id} session reestablished for ${session.actor.toString()}`
      )
      this.session = session
      this.setApi(this.session.client)
      this.store().setUser(session)
      return session
    } else {
      console.log("no saved sessions available")
      if (this.session) this.setApi(this.session.client) // set api to default chain
      return false
    }
  }

  getSessions():StoredSession[] {
    const key = `${this.appname}-list`
    if (LocalStorage.has(key)) {
      const data = LocalStorage.getItem(key)?.toString()
      if (data) return JSON.parse(data)
      else return []
    } else {
      return []
    }
  }
}

let link!:LinkManager
function init() {
  link = new LinkManager(useUser)
}
export { link, init }
