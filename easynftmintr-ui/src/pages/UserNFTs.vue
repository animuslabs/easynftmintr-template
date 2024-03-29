<template>
  <q-page class="q-mt-lg row items-top justify-evenly">
    <q-card class="fit row justify-center page-content" style="padding-bottom:100px;">
      <q-toolbar class="fit justify-center toolbar-menu">
        <q-toolbar class="fit row justify-center text-white">
          <q-btn-toggle
            v-model="viewMode" :options="viewOptions.map(option => ({ label: option, value: option }))"
            class="col-auto q-ma-md" unelevated active-class="buttons-active"
          />
          <q-input v-model="searchTerm" class="col-auto q-ma-md text-white" label="Search" label-color="white" input-class="text-white" />

        <!-- Here you can add your toggle buttons for filters -->
        </q-toolbar>
        <div v-if="selectedAccount != ''">
          <div
            v-if="mergedAssets.length > 0"
            class="row wrap justify-center"
          >
            <q-card
              v-for="asset in paginatedAssets"
              :key="asset.asset_id"
              class="q-ma-sm"
              :class="{'detailed-view-card': viewMode === 'detailed', 'simple-view-card': viewMode === 'simple'}"
            >
              <div
                v-if="viewMode === 'detailed'"
                class="q-ma-sm text-color"
              >
                <!-- Detailed view -->
                <div class="text-h6 fit row wrap justify-center content-center">
                  {{ getName(asset) }}
                </div>
                <div class="row wrap justify-center content-center">
                  <img
                    :src="ipfsImageUrl(getAssetIpfsHash(asset))"
                    alt="Asset Image"
                    :class="{'detailed-image': viewMode === 'detailed'}"
                    @click="openDialog(ipfsImageUrl(getAssetIpfsHash(asset)))"
                  >
                </div>
                <hr class="separator">
                <div class="col-12">
                  <div class="row justify-between text-weight-regular">
                    <div class="col-auto">
                      Asset
                    </div>
                    <div class="col-auto">
                      <a
                        :href="getAssetLink(asset)"
                        target="_blank"
                      >
                        {{ asset.asset_id }}
                      </a>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row justify-between text-weight-regular">
                    <div class="col-auto">
                      Collection
                    </div>
                    <div class="col-auto">
                      {{ asset.collection_name }}
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row justify-between text-weight-regular">
                    <div class="col-auto">
                      Schema
                    </div>
                    <div class="col-auto">
                      {{ asset.schema_name }}
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row justify-between text-weight-regular">
                    <div class="col-auto">
                      Template ID
                    </div>
                    <div class="col-auto">
                      <a
                        :href="getTemplateLink(asset)"
                        target="_blank"
                      >
                        {{ asset.template_id }}</a>
                    </div>
                  </div>
                </div>
                <hr class="separator">
                <div class="q-mt-md text-weight-regular">
                  <b>NFT Details</b>
                </div>
                <div class="text-weight-regular">
                  <div style="max-height: 300px; overflow-y: auto;">
                    <table class="q-table">
                      <tr
                        v-for="(value, key) in asset.immutable_serialized_data"
                        :key="key"
                      >
                        <td
                          class="text-subtitle2"
                          style="overflow-wrap: break-word;"
                        >
                          {{ key }}
                        </td>
                        <td
                          class="text-body2"
                          style="overflow-wrap: anywhere;"
                        >
                          {{ value }}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Simple view -->
              <div
                v-if="viewMode === 'simple'"
                class="q-ma-sm text-color"
              >
                <div class="text-bold fit row wrap justify-center content-center">
                  {{ getName(asset) }}
                </div>
                <div class="row items-center justify-center">
                  <div class="col-auto">
                    <img
                      :src="ipfsImageUrl(getAssetIpfsHash(asset))"
                      alt="Asset Image"
                      class="q-ma-sm"
                      :class="{'simple-image': viewMode === 'simple'}"
                      @click="openDialog(ipfsImageUrl(getAssetIpfsHash(asset)))"
                    >
                  </div>
                  <hr class="separator">
                  <div class="col-12">
                    <div class="row justify-between text-weight-regular">
                      <div class="col-auto">
                        Asset
                      </div>
                      <div class="col-auto">
                        <a
                          :href="getAssetLink(asset)"
                          target="_blank"
                        >
                          {{ asset.asset_id }}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="row justify-between text-weight-regular">
                      <div class="col-auto">
                        Template
                      </div>
                      <div class="col-auto">
                        <a
                          :href="getTemplateLink(asset)"
                          target="_blank"
                        >
                          {{ asset.template_id }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
        <div v-else>
          <div class="q-ma-md row justify-center  text-color">
            Please login to see NFTs in your inventory.
          </div>
        </div>
        <q-toolbar
          v-if="totalPages > 1"
          class="fixed-toolbar fit row justify-center toolbar-menu"
        >
          <q-pagination
            v-model="currentPage"
            :max="totalPages"
            :input="true"
            class="text-primary"
            icon-first="skip_previous"
            icon-last="skip_next"
            icon-prev="fast_rewind"
            icon-next="fast_forward"
          />
          <q-page-scroller
            position="bottom-right"
            :scroll-offset="400"
            :offset="[18, 18]"
          >
            <q-btn
              fab
              icon="keyboard_arrow_up"
            />
          </q-page-scroller>
        <!-- Here you can add your toggle buttons for filters -->
        </q-toolbar>
      </q-toolbar>
    </q-card>
  </q-page>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <div class="q-dialog-plugin-content">
      <img
        :src="dialogImageSrc"
        alt="Full-Screen Image"
        class="dialog-image"
        @click="showDialog = false"
      >
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref, computed } from "vue"
import { useStore } from "../stores/dataStore"
import { AssetRow } from "../components/atomic"
import { endpoints } from "../components/config"
import { useUser } from "../stores/anchorstore"
import { QPageScroller } from "quasar"

export default defineComponent({
  name: "IndexPage",
  components: {
    QPageScroller
  },
  setup() {
    const viewMode = ref("simple")
    const searchTerm = ref("")
    const viewOptions = ref(["detailed", "simple"])
    const getAssetLink = (asset:any) => `${endpoints[10][1]}${asset.asset_id}`
    const getTemplateLink = (asset:any) => `${endpoints[11][1]}${asset.collection_name}/${asset.template_id}`
    const store = useStore()
    const mergedAssets = ref<AssetRow[]>(store.mergedAssets)
    const userStore = useUser()
    const selectedAccount = computed(() => {
      return userStore.loggedIn.account || "" // Return the logged-in account name or the default account name
    })
    const showDialog = ref(false)
    const dialogImageSrc = ref("")
    const openDialog = (src:string) => {
      dialogImageSrc.value = src // Set the image source for the dialog
      showDialog.value = true // Open the dialog
    }
    const fetchAssets = async() => {
      // Fetch assets associated with the currently selected account
      await store.fetchMergedAssets(selectedAccount.value)

      // Update the reactive reference
      mergedAssets.value = store.mergedAssets.map((asset:AssetRow) => {
        // Return a new asset object that includes the IPFS hash
        return {
          ...asset,
          ipfsHash: getAssetIpfsHash(asset) // Extract IPFS hash
        }
      })
    }

    const ipfsImageUrl = (hash:string) => `${endpoints[3][1]}${hash}`
    const getName = (asset:any):string => {
      return (asset.immutable_serialized_data as any).name
    }
    const getAssetIpfsHash = (asset:AssetRow):string => {
      return asset.ipfsHash
    }
    const itemsPerPage = ref(10) // Number of items per page
    const currentPage = ref(1) // Current page number
    const filterMode = ref(false) // false means all NFTs will be shown, true means only non-unique NFTs will be shown

    const filteredAssets = computed(() => {
      // First, apply the template ID filter
      let assets = mergedAssets.value
      if (filterMode.value) {
        const templateCounts = mergedAssets.value.reduce((counts:Record<string, number>, asset) => {
          counts[asset.template_id] = (counts[asset.template_id] || 0) + 1
          return counts
        }, {})

        assets = mergedAssets.value.filter(asset => templateCounts[asset.template_id] > 1)
      }

      // Then, apply the search filter
      if (searchTerm.value) {
        assets = assets.filter(asset => getName(asset).toLowerCase().includes(searchTerm.value.toLowerCase()))
      }

      return assets
    })

    const totalPages = computed(() => Math.ceil(filteredAssets.value.length / itemsPerPage.value)) // Total pages
    const paginatedAssets = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredAssets.value.slice(start, end)
    })

    onMounted(async() => {
      await fetchAssets()
    })

    watch(() => store.mergedAssets, (newVal:AssetRow[]) => {
      mergedAssets.value = newVal // Update the reactive reference when the store's state changes
      console.log(newVal)
    })
    watch(selectedAccount, async(newVal, oldVal) => {
      if (newVal !== oldVal) {
        await fetchAssets()
      }
    }, { immediate: true }) // this option will run the handler immediately after the watcher is created

    return {
      mergedAssets,
      fetchAssets,
      selectedAccount,
      ipfsImageUrl,
      getAssetIpfsHash,
      getAssetLink,
      viewMode,
      viewOptions,
      getName,
      itemsPerPage,
      currentPage,
      totalPages,
      filterMode,
      filteredAssets,
      paginatedAssets,
      searchTerm,
      getTemplateLink,
      showDialog,
      dialogImageSrc,
      openDialog
    }
  }
})
</script>
<style scoped>
.toolbar-menu {
  /* background-color: var(--ltpurple); */
  /* Adjust color as needed */
  flex-wrap: wrap !important;
}

.buttons-active {
  --q-color: var(--ltbeige) !important;
  /* Adjust this with your color */
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--dark);
}

.simple-view-card {
  width: 325px;
  max-height: 450px;
  background-color: var(--darker);
  /* filter: drop-shadow(0px 22px 55px #ffd50050); */
  /* border: 4px solid var(--ltpurple); */
}

.detailed-view-card {
  max-width: 580px;
  max-height: 900px;
  padding:10px;
  margin:10px;
  background-color: var(--darker);
  /* filter: drop-shadow(0px 22px 55px #ffd50050); */
  /* border: 4px solid var(--ltpurple); */
}

.detailed-image {
  max-height: 300px;
  max-width: 100%;
}

.text-h6 {
  flex-grow: 1;
}

.simple-image {
  max-width: 300px;
  max-height: 275px;
  object-fit: fill;
  padding:20px;
}

.text-color {
  color: var(--ltbeige);
  /* CSS variable */
}

.separator {
  width: 100%;
  border: none;
  border-top: 1px solid var(--ltpurple);
  /* Change to desired color */
  margin: 10px 0;
  /* Adjust for desired spacing */
}

.text-weight-regular a {
  color: var(--ltbeige);
  /* CSS variable */
}

.dialog-image {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: contain;
}
</style>
