<template>
  <q-page class="row flex-center">
    <q-card class="q-pa-md justify-center" flat>
      <q-card-section>
        <div class="text-center">
          <q-img src="../assets/MEOW-token.png" style="max-width: 600px;" />
        </div>
        <div class="q-mt-lg text-center">
          Please login to see your NFTs in your inventory and what NFTs you can mint.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "IndexPage"
})
</script>

<style scoped>
.q-card {
  background-color: var(--primary);
  color: var(--ltbeige);
  width: 100%;
  max-width: 1100px;
  height: auto;
  margin: 0 auto;
}

.welcome-text {
  font-size: 24px;
  font-weight: bold;
}

.justify-center {
  justify-content: center;
}

.align-center {
  align-items: center;
}
</style>
