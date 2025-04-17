<template>
  <template v-if="itemOrMenu.meta && itemOrMenu.meta.levelHidden">
    <template v-for="route in itemOrMenu.children" :key="route.path">
      <vab-menu :item="route" />
    </template>
  </template>
  <el-sub-menu v-else :index="itemOrMenu.path">
    <template #title>
      <vab-icon
        v-if="itemOrMenu.meta && itemOrMenu.meta.icon"
        :icon="itemOrMenu.meta.icon"
        :is-custom-svg="itemOrMenu.meta.isCustomSvg"
        :title="translate(itemOrMenu.meta.title)"
      />
      <span :title="translate(itemOrMenu.meta.title)">
        {{ translate(itemOrMenu.meta.title) }}
      </span>
    </template>
    <slot></slot>
  </el-sub-menu>
</template>

<script lang="ts" setup>
import { translate } from '/@/i18n'

defineOptions({
  name: 'VabSubMenu',
})

defineProps({
  itemOrMenu: {
    type: Object,
    default: () => {},
  },
})
</script>
