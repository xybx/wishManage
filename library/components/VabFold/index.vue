<template>
  <vab-icon class="fold-unfold" :icon="collapse ? unfold : fold" @click="toggleCollapse" />
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabFold',
})

defineProps({
  unfold: {
    type: String,
    default: 'menu-unfold-line',
  },
  fold: {
    type: String,
    default: 'menu-fold-line',
  },
})
const settingsStore = useSettingsStore()
const { collapse } = storeToRefs(settingsStore)
const { toggleCollapse } = settingsStore
</script>

<style lang="scss" scoped>
.fold-unfold {
  color: var(--el-color-grey);
  cursor: pointer;
}
</style>
