import { LocalStorage } from "quasar"
import AnchorLink, { APIClient, ChainId, LinkSession, PermissionLevel, TransactArgs } from "anchor-link"
import AnchorLinkBrowserTransport from "anchor-link-browser-transport"
import { useUser } from "src/stores/anchorstore"
import { networks, appname, endpoints } from "src/components/config"
const client = new APIClient({ url: endpoints[1][1] })
// const session:LinkChannelSession = {}
export interface StoredSession {
  auth:{actor:string, permission:string},
  chainId:ChainId
}
class LinkManager {
  store:typeof useUser
  appname = appname
  session:LinkSession | null = null
  transport = new AnchorLinkBrowserTransport({ storagePrefix: "ba" })
  client!:APIClient
  rpc!:typeof client.v1.chain
  link = new AnchorLink({
    transport: this.transport,
    chains: networks
  })

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
    const identity = await this.link.login(this.appname)
    if (identity) {
      const { session } = identity
      this.session = session
      this.setApi(this.session.client)
      this.try_restore_session()
      console.log(session.auth)
    }
  }

  async logout() {
    if (this.session) {
      await this.link.removeSession(
        this.appname,
        this.session.auth,
        this.session.chainId
      )
      this.session = null
      this.setApi(this.link.client)
      this.store().setUser(false)
      // this.try_restore_session()
    } else {
      console.log("you can't logout if there is no active session")
    }
  }

  async deleteSession(permissionlevel:PermissionLevel, chainId:ChainId):Promise<void> {
    if (!this.session) return this.link.removeSession(this.appname, permissionlevel, chainId)
    console.log(this.session.auth.equals(permissionlevel))
    console.log(this.session.chainId.equals(chainId))
    if (this.session.auth.equals(permissionlevel) && this.session.chainId.equals(chainId)) {
      console.log("current session")
      this.logout()
    } else {
      await this.link.removeSession(this.appname, permissionlevel, chainId)
    }
  }

  async restore_session(permissionlevel:PermissionLevel, chainId:ChainId):Promise<void> {
    const session = await this.link.restoreSession(
      this.appname,
      permissionlevel,
      chainId
    )
    // console.log(session);
    if (session) {
      this.session = session
      this.setApi(this.session.client)
      this.store().setUser(session)
    }
  }

  async try_restore_session():Promise<false | LinkSession> {
    const session = await this.link.restoreSession(this.appname)
    if (session) {
      console.log(
        `${session.chainId} session reestablished for ${session.auth}`
      )
      this.session = session
      this.setApi(this.session.client)
      this.store().setUser(session)
      return session
    } else {
      console.log("no saved sessions available")
      this.setApi(this.link.client) // set api to default chain
      return false
    }
  }

  getSessions():StoredSession[] {
    const key = `ba-${this.appname}-list`
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
