<template>
  <div
    class="vab-layout-horizontal"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <div
      class="vab-layout-header"
      :class="{
        'fixed-header': fixedHeader,
      }"
    >
      <vab-header layout="horizontal" />
      <div
        v-show="showTabs"
        :class="{
          'vab-tabs-horizontal': showTabs,
        }"
      >
        <div class="vab-main">
          <vab-tabs />
        </div>
      </div>
    </div>
    <div class="vab-main main-padding">
      <vab-app-main />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabLayoutHorizontal',
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
  device: {
    type: String,
    default: 'desktop',
  },
})
</script>

<style lang="scss" scoped>
.vab-layout-horizontal {
  :deep() {
    .vab-main {
      width: 92% !important;
      margin: auto !important;
    }
  }

  .vab-tabs-horizontal {
    background: var(--el-color-white);
  }

  .vab-nav {
    .fold-unfold {
      display: none;
    }
  }
}
</style>
