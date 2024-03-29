import { defineStore } from "pinia"

export const useViewModeStore = defineStore({
  id: "viewMode",
  state: () => ({
    viewMode: "detailed",
    viewOptions: ["detailed", "simple"]
  }),
  getters: {
    getViewMode: (state) => state.viewMode,
    getViewOptions: (state) => state.viewOptions
  },
  actions: {
    setViewMode(mode:any) {
      this.viewMode = mode
    }
  }
})
