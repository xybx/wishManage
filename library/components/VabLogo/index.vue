<template>
  <div
    class="vab-logo"
    :class="{
      ['vab-logo-' + theme.layout]: true,
    }"
  >
    <router-link to="/">
      <span class="logo">
        <!-- 使用自定义svg示例 -->
        <vab-icon v-if="logo" :icon="logo" is-custom-svg />
      </span>
      <span class="title" :class="{ 'hidden-xs-only': theme.layout === 'horizontal' }">
        {{ title }}
      </span>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabLogo',
})

const settingsStore = useSettingsStore()
const { theme, logo, title } = storeToRefs(settingsStore)
</script>

<style lang="scss" scoped>
@mixin container {
  position: relative;
  height: var(--el-header-height);
  overflow: hidden;
  line-height: var(--el-header-height);
  background: transparent;
}

@mixin logo {
  display: inline-block;
  width: 58px;
  height: 58px;
  color: var(--el-title-color);
  vertical-align: middle;
  fill: currentColor;
}

@mixin title {
  display: inline-block;
  margin-left: 5px;
  overflow: hidden;
  font-size: 20px;
  line-height: 55px;
  color: var(--el-title-color);
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.vab-logo {
  &-horizontal {
    @include container;

    .logo {
      svg,
      img {
        @include logo;
      }
    }

    .title {
      @include title;
    }
  }

  &-vertical,
  &-column,
  &-comprehensive,
  &-fall {
    @include container;

    height: var(--el-logo-height);
    line-height: var(--el-logo-height);
    text-align: center;

    .logo {
      svg,
      img {
        @include logo;
      }
    }

    .title {
      @include title;
      max-width: calc(var(--el-left-menu-width) - 60);
    }
  }

  &-column {
    background: var(--el-color-white) !important;

    .logo {
      position: fixed;
      top: 0;
      display: block;
      width: var(--el-left-menu-width-min);
      height: var(--el-logo-height);
      margin: 0;
      background: var(--el-menu-background-color);
    }

    .title {
      position: fixed;
      left: var(--el-left-menu-width-min) !important;
      box-sizing: border-box;
      display: block !important;
      width: calc(var(--el-left-menu-width) - var(--el-left-menu-width-min) - 1px);
      height: var(--el-nav-height);
      margin-left: 0 !important;
      color: var(--el-color-grey) !important;
      background: var(--el-color-white) !important;
      border-bottom: 1px solid var(--el-border-color);

      @include title;
    }
  }
}
</style>
