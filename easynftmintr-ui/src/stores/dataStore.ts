import { defineStore } from "pinia"
import { mergeTemplatesAndAssets, AssetRow, getAllSchemas, SchemaData, extractIpfsHashFromTemplates, ExtendedTemplateRow, collections } from "../components/atomic"

export const useStore = defineStore("dataStore", {
  state: () => ({
    mergedAssets: [] as AssetRow[],
    schemas: [] as SchemaData[],
    deserializedTemplates: [] as ExtendedTemplateRow[]
  }),

  actions: {
    async fetchMergedAssets(accountName:string) {
      this.mergedAssets = await mergeTemplatesAndAssets(accountName, collections)
    },
    async fetchAllSchemas() {
      this.schemas = await getAllSchemas()
    },
    async fetchDeserializedTemplates() {
      this.deserializedTemplates = await extractIpfsHashFromTemplates(collections)
    }
  }
})
