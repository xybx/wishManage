<template>
  <div class="vab-header">
    <div class="vab-main">
      <div class="right-panel">
        <vab-logo />
        <el-menu
          v-if="'horizontal' === layout"
          active-text-color="var(--el-menu-color-text)"
          background-color="var(--el-menu-background-color)"
          :default-active="activeMenu.data"
          menu-trigger="hover"
          mode="horizontal"
          text-color="var(--el-menu-color-text)"
        >
          <vab-menu v-for="(item, index) in handleRoutes" :key="index + item['name']" :item="item" :layout="layout" />
        </el-menu>
        <vab-right-tools is-horizontal />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoutesStore } from '/@/store/modules/routes'

defineOptions({
  name: 'VabHeader',
})

defineProps({
  layout: {
    type: String,
    default: 'horizontal',
  },
})

const routesStore = useRoutesStore()
const { getActiveMenu: activeMenu, getRoutes: routes } = storeToRefs(routesStore)

const handleRoutes = computed(() =>
  routes.value.flatMap((route:any) => (route.meta && route.meta.levelHidden && route.children ? [...route.children] : route))
)
</script>

<style lang="scss">
.vab-header .vab-main .right-panel {
  .el-menu.el-menu--horizontal {
    width: calc(100vw * 0.92 - 195px - 435px) !important;
  }
}
</style>

<style lang="scss" scoped>
.vab-header {
  display: flex;
  align-items: center;
  justify-items: flex-end;
  height: var(--el-header-height);
  background: var(--el-menu-background-color);

  .vab-main {
    padding: 0 var(--el-padding) 0 var(--el-padding);

    .right-panel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--el-header-height);

      :deep() {
        .vab-logo-horizontal {
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .el-sub-menu__icon-more {
          margin-right: var(--el-margin) !important;
        }

        .el-sub-menu__hide-arrow {
          .el-sub-menu__title {
            padding-right: 0;
          }
        }

        .el-menu {
          &.el-menu--horizontal {
            width: 60%;
            height: 40px;
            border: 0;

            * {
              border: 0;
            }

            > .el-menu-item {
              border-radius: var(--el-border-radius-base);

              &.is-active {
                background: var(--el-color-primary) !important;
              }
            }
          }

          [class*='ri-'] {
            margin-left: 0;
          }
        }

        .username,
        .username + i {
          color: var(--el-color-white);
        }

        [class*='ri-'] {
          margin-left: var(--el-margin);
          color: var(--el-color-white);
        }
      }
    }
  }
}
</style>

<style>
.el-popper.is-pure.is-light:has(.el-menu--horizontal, .el-menu--popup-container) {
  margin-top: calc(var(--el-margin) * 0.4);
  border: 0;
}
</style>
