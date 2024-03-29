<template>
  <q-layout view="hHh lpR fFf" class="bg-primary">
    <q-header class="bg-primary border-bottom" height-hint="80" style="border-bottom: 1px solid var(--secondary);">
      <q-toolbar class="toolbar-content">
        <q-toolbar-title class="order-avatar" style="height: 100%; width: 100%">
          <q-btn @click="$router.push('/')" flat>
            <img src="../assets/MEOW-logo.png" alt="Meow NFTs" class="q-ma-sm" style="height: 60px; width: auto;">
          </q-btn>
        </q-toolbar-title>
        <!-- buttons for internal and external navigation -->
        <q-btn label="MINT" flat @click="$router.push('/templates')" class="order-mint" text-color="accent" />
        <q-btn label="INVENTORY" flat @click="$router.push('/inventory')" class="order-inventory" text-color="accent" />

        <!-- <q-btn label="Telos-TG" flat @click="openTGLink" class="order-lore" text-color="accent" /> -->
        <q-btn label="ORIGIN" flat @click="openWebsite" class="order-lore" text-color="accent" />
        <div v-if="!user.loggedIn.auth" class="order-login">
          <q-btn label="login" flat text-color="accent" class="font-bold" @click="login" />
        </div>
        <div v-else class="order-logged-in">
          <q-btn :icon="`img:${logoImage}`" :label="loggedInAccount" text-color="accent" flat class="font-bold">
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
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { link, init, StoredSession } from "../components/anchor"
import { getNetworkByChainId } from "src/components/config"
import { useUser } from "../stores/anchorstore"
import { PermissionLevel } from "anchor-link"

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
        return getNetworkByChainId(this.user.getLoggedIn.chainId).logo
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
    async restoreSession(session:StoredSession) {
      const permissionLevel = PermissionLevel.from(session.auth)
      await link.restore_session(permissionLevel, session.chainId)
    },
    async deleteSession(session:StoredSession) {
      const permissionLevel = PermissionLevel.from(session.auth)
      await link.deleteSession(permissionLevel, session.chainId)
    },
    openTGLink() {
      window.open("https://t.me/HelloTelos/698277", "_blank")
    },
    openWebsite() {
      window.open("https://meow.institute", "_blank")
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
}

.footer-class div {
  flex: 0 0 auto;
  margin: 15px;
}

.footer-class img {
  width: 25px;
  height: auto;
  filter: invert(54%) sepia(85%) saturate(4500%) hue-rotate(267deg) brightness(78%) contrast(62%);
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
