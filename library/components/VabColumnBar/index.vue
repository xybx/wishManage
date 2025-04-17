<template>
  <el-scrollbar
    class="vab-column-bar"
    :class="{
      'is-collapse': collapse,
      ['vab-column-bar-' + theme.columnStyle]: true,
    }"
  >
    <vab-logo style="z-index: 999" />
    <el-tabs v-model="tab.data" tab-position="left" @tab-click="handleTabClick">
      <template v-for="(item, index) in routes" :key="index + item.name">
        <el-tab-pane :name="item.name">
          <template #label>
            <div
              class="vab-column-grid"
              :class="{
                ['vab-column-grid-' + theme.columnStyle]: true,
              }"
              :title="translate(item.meta.title)"
            >
              <div>
                <vab-icon v-if="item.meta.icon" :icon="item.meta.icon" :is-custom-svg="item.meta.isCustomSvg" />
                <span v-if="translate(item.meta.title).length < 4">
                  {{ translate(item.meta.title) }}
                </span>
                <span v-else style="font-size: var(--el-font-size-small); zoom: 0.88">
                  {{ translate(item.meta.title) }}
                </span>
              </div>
            </div>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>

    <el-menu
      ref="menuRef"
      background-color="var(--el-menu-background-color-second)"
      :default-active="activeMenu.data"
      :default-openeds="defaultOpeneds"
      mode="vertical"
      :unique-opened="uniqueOpened"
    >
      <vab-menu v-for="item in partialRoutes" :key="item.path" :item="item" />
    </el-menu>
    <div class="float-fold">
      <vab-fold fold="contract-left-line" unfold="contract-right-line" />
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { defaultOpeneds, isHashRouterMode, openFirstMenu, uniqueOpened } from '/@/config'
import { translate } from '/@/i18n'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'
import { isExternal } from '/@/utils/validate'

defineOptions({
  name: 'VabColumnBar',
})

const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()
const { collapse, device, theme } = storeToRefs(settingsStore)
const { foldSideBar, openSideBar } = settingsStore
const routesStore = useRoutesStore()
const {
  getTab: tab,
  getTabMenu: tabMenu,
  getActiveMenu: activeMenu,
  getRoutes: routes,
  getPartialRoutes: partialRoutes,
} = storeToRefs(routesStore)
const menuRef = ref<any>(null)
let timer: ReturnType<typeof setInterval>

const setDefaultOpeneds = () => {
  timer = setTimeout(() => {
    defaultOpeneds.forEach((item: string) => {
      try {
        menuRef.value.open(item)
      } catch {
        /* empty */
      }
    })
  }, 0)
}

const handleTabClick = () => {
  nextTick(() => {
    if (tabMenu.value.meta.target === '_blank') {
      if (route.path !== tabMenu.value.path) {
        isHashRouterMode ? window.open(`#${tabMenu.value.path}`) : window.open(tabMenu.value.path)
        router.push('/redirect')
      }
    } else if (isExternal(tabMenu.value.path)) {
      window.open(tabMenu.value.path)
      router.push('/redirect')
    } else if (openFirstMenu) router.push(tabMenu.value.redirect || tabMenu.value)
    setDefaultOpeneds()
  })
}

onMounted(() => {
  nextTick(() => {
    setDefaultOpeneds()
    if (theme.value.layout === 'column')
      watch(
        route,
        () => {
          const foldUnfold: any = document.querySelector('.left-panel .fold-unfold')
          const floatFold: any = document.querySelector('.float-fold')
          if (route.meta.noColumn && theme.value.layout === 'column') {
            if (device.value !== 'mobile') foldSideBar()
            if (foldUnfold) foldUnfold.style = 'opacity:0'
            if (floatFold) floatFold.style = 'opacity:0'
          } else {
            if (device.value !== 'mobile') openSideBar()
            if (foldUnfold) foldUnfold.style = 'opacity:1'
            if (floatFold) floatFold.style = 'opacity:1'
          }
        },
        {
          immediate: true,
        }
      )
  })
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style lang="scss" scoped>
@mixin active {
  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);

    i,
    svg {
      color: var(--el-color-primary);
    }
  }

  &.is-active {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}

.vab-column-bar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--el-left-menu-width);
  overflow: hidden;
  background: var(--el-color-white);
  border-right: 1px solid var(--el-border-color);

  &-vertical,
  &-card,
  &-arrow {
    :deep() {
      .el-tabs + .el-menu {
        left: var(--el-left-menu-width-min);
        width: calc(var(--el-left-menu-width) - var(--el-left-menu-width-min));
        border: 0;
      }
    }
  }

  &-horizontal,
  &-semicircle {
    .float-fold {
      left: 26.5px;
    }

    :deep() {
      .vab-logo-column {
        .logo {
          width: calc(var(--el-left-menu-width-min) * 1.4) !important;
        }

        .title {
          left: calc(var(--el-left-menu-width-min) * 1.4) !important;
          width: calc(var(--el-left-menu-width) - calc(var(--el-left-menu-width-min) * 1.4) - 1px);
        }
      }

      .el-tabs + .el-menu {
        left: calc(var(--el-left-menu-width-min) * 1.4);
        width: calc(var(--el-left-menu-width) - var(--el-left-menu-width-min) * 1.4);
        border: 0;
      }
    }
  }

  &-card {
    :deep() {
      .el-tabs {
        .el-tabs__item {
          padding: 5px !important;

          .vab-column-grid {
            width: calc(var(--el-left-menu-width-min) - 12px) !important;
            height: calc(var(--el-left-menu-width-min) - 10px) !important;
            margin-left: 2px;
            border-radius: var(--el-border-radius-base);

            &:hover {
              background: var(--el-color-primary);
            }
          }

          &.is-active {
            background: transparent !important;

            .vab-column-grid {
              background: var(--el-color-primary);
            }
          }
        }
      }

      .el-tabs + .el-menu {
        left: calc(var(--el-left-menu-width-min) + 10px);
        width: calc(var(--el-left-menu-width) - var(--el-left-menu-width-min) - 20px);
      }

      .el-sub-menu .el-sub-menu__title,
      .el-menu-item {
        min-width: 180px;
        margin-bottom: 5px;
        border-radius: var(--el-border-radius-base);
      }
    }
  }

  &-arrow {
    :deep() {
      .el-tabs {
        .el-tabs__item {
          &.is-active {
            background: transparent !important;

            .vab-column-grid {
              background: transparent !important;

              &:after {
                position: absolute;
                right: -1px;
                width: 0;
                height: 0;
                overflow: hidden;
                content: '';
                border-color: transparent var(--el-color-white) transparent transparent;
                border-style: solid dashed dashed;
                border-width: 8px;
              }
            }
          }
        }
      }

      .el-tabs + .el-menu {
        left: calc(var(--el-left-menu-width-min) + 10px);
        width: calc(var(--el-left-menu-width) - var(--el-left-menu-width-min) - 20px);
      }

      .el-sub-menu .el-sub-menu__title,
      .el-menu-item {
        min-width: 180px;
        margin-bottom: 5px;
        border-radius: var(--el-border-radius-base);
      }
    }
  }

  &-semicircle {
    :deep() {
      .el-tabs {
        .el-tabs__item {
          &.is-active {
            border-top-left-radius: 99px;
            border-bottom-left-radius: 99px;
          }
        }
      }
    }
  }

  .vab-column-grid {
    display: flex;
    align-items: center;
    width: var(--el-left-menu-width-min);
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;

    &-vertical,
    &-card,
    &-arrow {
      justify-content: center;
      height: var(--el-left-menu-width-min);

      > div {
        svg,
        [class*='ri-'] {
          display: block;
          height: 20px;
        }
      }
    }

    &-horizontal,
    &-semicircle {
      justify-content: left;
      width: calc(var(--el-left-menu-width-min) * 1.4);
      height: calc(var(--el-left-menu-width-min) / 1.4);
      padding-left: var(--el-padding);

      svg,
      [class*='ri-'] {
        margin-right: 3px;
      }
    }
  }

  :deep() {
    * {
      transition: var(--el-transition);
    }

    .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .el-tabs {
      position: fixed;
      z-index: 9999;

      .el-tabs__header.is-left {
        margin-right: 0 !important;

        .el-tabs__nav-wrap.is-left {
          margin-right: 0 !important;
          background: var(--el-menu-background-color);

          .el-tabs__nav-scroll {
            height: 100%;
            overflow-y: auto;

            &::-webkit-scrollbar {
              width: 0;
              height: 0;
            }
          }
        }
      }

      .el-tabs__nav {
        height: calc(var(--vh, 1vh) * 100 - var(--el-logo-height));
        background: var(--el-menu-background-color);
      }

      .el-tabs__item {
        height: auto;
        padding: 0;
        color: var(--el-color-white);

        &.is-active {
          margin-right: -1px;
          background: var(--el-color-primary);

          > .vab-column-grid {
            margin-right: 1px;
          }
        }
      }
    }

    .el-tabs__active-bar.is-left,
    .el-tabs--left .el-tabs__nav-wrap.is-left::after {
      display: none;
    }

    .el-menu {
      margin-top: 10px;
      border: 0;

      .el-menu-item,
      .el-sub-menu__title {
        height: var(--el-menu-item-height);
        overflow: hidden;
        line-height: var(--el-menu-item-height);
        text-overflow: ellipsis;
        white-space: nowrap;

        @include active;
      }
    }
  }

  &.is-collapse {
    :deep() {
      width: 0;
    }
  }
}

.float-fold {
  position: fixed;
  bottom: 13px;
  left: 14px;
  z-index: 9999;
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  background: var(--el-color-primary);
  border-radius: var(--el-border-radius-base);

  :deep() {
    .fold-unfold,
    .ri-user-heart-line {
      font-size: 20px;
      color: var(--el-color-white);
      cursor: pointer;
    }
  }
}
</style>
