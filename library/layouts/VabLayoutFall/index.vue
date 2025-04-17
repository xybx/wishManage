<template>
  <div
    class="vab-layout-fall"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <vab-fall-bar />
    <div
      class="vab-main"
      :class="{
        'is-collapse-main': collapse,
        'is-no-tabs': !showTabs,
      }"
    >
      <div
        class="vab-layout-header"
        :class="{
          'fixed-header': fixedHeader,
          'is-no-tabs': !showTabs,
        }"
      >
        <vab-nav />
        <vab-tabs v-show="showTabs" />
      </div>
      <vab-app-main />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabLayoutFall',
})

defineProps({
  collapse: {
    type: Boolean,
    default: false,
  },
  fixedHeader: {
    type: Boolean,
    default: true,
  },
  showTabs: {
    type: Boolean,
    default: true,
  },
})
</script>

<style lang="scss" scoped>
.vab-layout-fall {
  .vab-main {
    &.is-collapse-main {
      &.vab-main-horizontal,
      &.vab-main-semicircle {
        margin-left: calc(var(--el-left-menu-width-min) * 1.4);

        :deep() {
          .fixed-header {
            width: calc(100% - var(--el-left-menu-width-min) * 1.4);
          }
        }
      }
    }
  }
}
</style>
