<template>
  <q-layout view="hHh lpR fFf" class="bg-primary">
    <q-header height-hint="80" style="border-bottom: 1px solid var(--secondary);">
      <q-toolbar class="toolbar-content">
        <q-toolbar-title class="order-avatar" style="height: 100%; width: 100%" />
        <!-- buttons for internal and external navigation -->
        <!-- <q-btn label="MINT" flat class="order-mint" text-color="white" to="/templates" />
        <q-btn label="INVENTORY" flat @click="$router.push('/inventory')" class="order-inventory" text-color="white" /> -->

        <!-- <q-btn label="ORIGIN" flat @click="openWebsite" class="order-lore" text-color="accent" /> -->
        <q-tabs
          class="text-white"
        >
          <q-route-tab name="index" to="/" icon="img:/MEOW-logo.png" />
          <q-route-tab name="mails" label="Mint" to="/templates" />
          <q-route-tab name="alarms" label="Inventory" to="/inventory" />
        </q-tabs>
        <div v-if="!user.loggedIn.auth" class="order-login">
          <q-btn label="login" flat text-color="white" class="font-bold" @click="login" />
        </div>
        <div v-else class="order-logged-in">
          <q-btn :icon="`img:${logoImage}`" :label="loggedInAccount" text-color="white" flat>
            <q-menu dense separator class="no-border-radius">
              <q-list>
                <q-item class="text-primary text-weight-bold" clickable v-close-popup @click="logout">
                  <q-item-section avatar>
                    <q-icon name="logout" color="secondary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-secondary">
                      Logout <!-- Changed label to Logout -->
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <!-- Rest of the code -->
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
      <div class="footer-class">
        <div>
          <q-btn
            :stack="false"
            color="white"
            flat
            type="a"
            href="https://boid.com"
          >
            <template #default>
              <div class="row items-center">
                <div class="q-mr-xs q-mt-xs">
                  built by the team at
                </div>
                <q-img src="/boidlogo-vert.png" style="width: 90px; height: auto" />
              </div>
            </template>
          </q-btn>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { link, init, StoredSession } from "../components/anchor"
import { getNetworkByChainId } from "src/components/config"
import { useUser } from "../stores/anchorstore"

export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      user: useUser(),
      showDialog: false,
      link
    }
  },
  computed: {
    logoImage():string {
      if (this.user.getLoggedIn && this.user.getLoggedIn.chainId) {
        return getNetworkByChainId(this.user.getLoggedIn.chainId).logo?.toString() || ""
      } else {
        return ""
      }
    },
    loggedInAccount():string {
      return this.user.getLoggedIn !== false && this.user.getLoggedIn.account !== null
        ? this.user.getLoggedIn.account
        : ""
    }
  },

  methods: {
    getNetworkByChainId,
    async login() {
      await link.login()
    },
    async logout() {
      await link.logout()
    },
    // async restoreSession(session:StoredSession) {
    //   const permissionLevel = PermissionLevel.from(session.auth)
    //   await link.restore_session(permissionLevel, session.chainId)
    // },
    // async deleteSession(session:StoredSession) {
    //   const permissionLevel = PermissionLevel.from(session.auth)
    //   await link.deleteSession(permissionLevel, session.chainId)
    // },
    openTGLink() {
      window.open("", "_blank")
    },
    openWebsite() {
      window.open("", "_blank")
    }
  },
  created() {
    init() // Initialize LinkManager Class from anchor-link
  }
})
</script>
<style>
.border-bottom {
  border-bottom: 1px solid var(--secondary);
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}

.order-inventory,
.order-mint,
.order-lore,
.font-bold {
  font-weight: bold;
}

.order-avatar {
  order: 1;
}

.order-inventory {
  order: 3;
}

.order-mint {
  order: 2;
}

.order-lore {
  order: 4;
}

.order-login {
  order: 5;
}

.order-logged-in {
  order: 6;
}

.toolbar-content {
  display: flex;
  flex-wrap: wrap;
}

.footer-class {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height:60px;
}

.footer-class div {
  flex: 0 0 auto;
  /* margin: 15px; */
}

.footer-class img {
  width: 90px;
  height: auto;
  /* filter: invert(54%) sepia(85%) saturate(4500%) hue-rotate(267deg) brightness(78%) contrast(62%); */
}

@media screen and (max-width: 480px) {
  .toolbar-content {
    flex-wrap: wrap;
  }

  .order-avatar {
    width: 33%;
    text-align: center;
    order: 1;

  }

  .order-inventory {
    order: 3;
    width: 33%;
    text-align: right;

  }

  .order-mint {
    order: 2;
    width: 33%;
    text-align: right;
  }

  .order-lore {
    order: 4;
    width: 50%;
    text-align: center;
  }

  .order-login {
    order: 5;
    width: 50%;
    text-align: center;
  }

  .order-logged-in {
    order: 5;
    width: 50%;
    text-align: center;
  }

  .footer-class {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    justify-items: center;
  }

  .footer-class div {
    width: auto;
    flex-grow: 0;
  }

  .footer-class div:nth-child(n+4) {
    grid-row: 1;
  }
}
</style>
