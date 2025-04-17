<template>
  <div class="vab-tabs">
    <el-tabs
      v-model="tabActive"
      class="vab-tabs-content"
      :class="{ ['vab-tabs-content-' + theme.tabsBarStyle]: true }"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane v-for="item in visitedRoutes" :key="item.path" :closable="!isNoClosable(item)" lazy :name="item.path">
        <template #label>
          <span class="vab-tabs-title" @contextmenu.prevent="openMenu(item)">
            <template v-if="theme.showTabsIcon">
              <vab-icon v-if="item.meta && item.meta.icon" :icon="item.meta.icon" :is-custom-svg="item.meta.isCustomSvg" />
              <vab-icon v-else :icon="item.parentIcon" />
            </template>
            <span v-if="!isNoClosable(item)" @dblclick="handleTabRemove(item.path)">
              {{ translate(item.meta.title) }}
            </span>
            <span v-else>
              {{ translate(item.meta.title) }}
            </span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <el-dropdown
      placement="bottom-end"
      popper-class="vab-tabs-more-dropdown"
      @command="handleCommand"
      @visible-change="handleVisibleChange"
    >
      <span class="vab-tabs-more" :class="{ 'vab-tabs-more-active': active }">
        <span class="vab-tabs-more-icon">
          <i class="box box-t"></i>
          <i class="box box-b"></i>
        </span>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="tabs-more">
          <el-dropdown-item command="refresh">
            <vab-icon icon="refresh-line" />
            <span>
              {{ translate('刷新') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeOthersTabs">
            <vab-icon icon="close-line" />
            <span>
              {{ translate('关闭其他') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeLeftTabs">
            <vab-icon icon="arrow-left-line" />
            <span>
              {{ translate('关闭左侧') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeRightTabs">
            <vab-icon icon="arrow-right-line" />
            <span>
              {{ translate('关闭右侧') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="closeAllTabs">
            <vab-icon icon="close-line" />
            <span>
              {{ translate('关闭全部') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item command="setting">
            <vab-icon icon="settings-5-line" />
            <span>
              {{ translate('标签设置') }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <ul v-if="visible" class="contextmenu el-dropdown-menu" :style="{ left: left + 'px', top: top + 'px' }">
      <li class="el-dropdown-menu__item" @click="refresh">
        <vab-icon icon="refresh-line" />
        <span>{{ translate('刷新') }}</span>
      </li>
      <li class="el-dropdown-menu__item" :class="{ 'is-disabled': visitedRoutes.length === 1 }" @click="closeOthersTabs">
        <vab-icon icon="close-line" />
        <span>{{ translate('关闭其他') }}</span>
      </li>
      <li class="el-dropdown-menu__item" :class="{ 'is-disabled': !visitedRoutes.indexOf(hoverRoute) }" @click="closeLeftTabs">
        <vab-icon icon="arrow-left-line" />
        <span>{{ translate('关闭左侧') }}</span>
      </li>
      <li
        class="el-dropdown-menu__item"
        :class="{
          'is-disabled': visitedRoutes.indexOf(hoverRoute) === visitedRoutes.length - 1,
        }"
        @click="closeRightTabs"
      >
        <vab-icon icon="arrow-right-line" />
        <span>{{ translate('关闭右侧') }}</span>
      </li>
      <li class="el-dropdown-menu__item" @click="closeAllTabs">
        <vab-icon icon="close-line" />
        <span>{{ translate('关闭全部') }}</span>
      </li>
    </ul>

    <vab-tabs-setting ref="tabsSettingRef" />
  </div>
</template>

<script lang="ts" setup>
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { translate } from '/@/i18n'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath, handleTabs } from '/@/utils/routes'

defineOptions({
  name: 'VabTabs',
})

defineProps({
  layout: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
const routesStore = useRoutesStore()
const { getRoutes: routes } = storeToRefs(routesStore)
const tabsStore = useTabsStore()
const { getVisitedRoutes: visitedRoutes } = storeToRefs(tabsStore)
const {
  addVisitedRoute,
  delVisitedRoute,
  delOthersVisitedRoutes,
  delLeftVisitedRoutes,
  delRightVisitedRoutes,
  delAllVisitedRoutes,
  handleCaughtRoutes,
} = tabsStore
const tabActive = ref<string>('')
const active = ref<boolean>(false)
const hoverRoute = ref<any>()
const visible = ref<boolean>(false)
const top = ref<any>(0)
const left = ref<any>(0)

const tabsSettingRef = ref<any>(null)

const isActive = (path: any) => path === handleActivePath(route, true)
const isNoClosable = (tag: { meta: { noClosable: any } }) => tag.meta && tag.meta.noClosable

const handleTabClick: any = (tab: any) => {
  if (!isActive(tab.name)) router.push(visitedRoutes.value[tab.index])
}
const handleVisibleChange = (value: boolean) => {
  active.value = value
}

const initNoCLosableTabs = (routes: any[]) => {
  routes.forEach((_route: { meta: { noClosable: any }; children: any }) => {
    if (_route.meta && _route.meta.noClosable) addTabs(_route)
    if (_route.children) initNoCLosableTabs(_route.children)
  })
}

const handleCommand = (command: any) => {
  switch (command) {
    case 'refresh': {
      refresh()
      break
    }
    case 'closeOthersTabs': {
      closeOthersTabs()
      break
    }
    case 'closeLeftTabs': {
      closeLeftTabs()
      break
    }
    case 'closeRightTabs': {
      closeRightTabs()
      break
    }
    case 'closeAllTabs': {
      closeAllTabs()
      break
    }
    case 'setting': {
      tabsSettingRef.value.handleOpenSetting()
    }
  }
}

/**
 * 刷新当前标签页
 */
const refresh = async () => {
  if (hoverRoute.value) {
    await router.push(hoverRoute.value)
    await $pub('reload-router-view', hoverRoute.value.name)
  } else await $pub('reload-router-view')
  await $pub('refresh-rotate')
  await closeMenu()
}

/**
 * 添加标签页
 * @param tag route
 * @returns {Promise<void>}
 */
const addTabs = async (tag: VabRoute | RouteLocationNormalizedLoaded) => {
  const tab = handleTabs(tag)
  if (tab) {
    await addVisitedRoute(tab)
    tabActive.value = tab.path
  }
}

/**
 * 根据原生路径删除标签中的标签
 * @param rawPath 原生路径
 * @returns {Promise<void>}
 */
const handleTabRemove: any = async (rawPath: string) => {
  if (isActive(rawPath)) await toLastTab()
  await delVisitedRoute(rawPath)
}

/**
 * 删除其他标签页
 * @returns {Promise<void>}
 */
const closeOthersTabs = async () => {
  if (hoverRoute.value) {
    await router.push(hoverRoute.value)
    await delOthersVisitedRoutes(hoverRoute.value.path)
  } else await delOthersVisitedRoutes(handleActivePath(route, true))
  await closeMenu()
}
/**
 * 删除左侧标签页
 * @returns {Promise<void>}
 */
const closeLeftTabs = async () => {
  if (hoverRoute.value) {
    await router.push(hoverRoute.value)
    await delLeftVisitedRoutes(hoverRoute.value.path)
  } else await delLeftVisitedRoutes(handleActivePath(route, true))
  await closeMenu()
}

/**
 * 删除右侧标签页
 * @returns {Promise<void>}
 */
const closeRightTabs = async () => {
  if (hoverRoute.value) {
    await router.push(hoverRoute.value)
    await delRightVisitedRoutes(hoverRoute.value.path)
  } else await delRightVisitedRoutes(handleActivePath(route, true))
  await closeMenu()
}

/**
 * 删除所有标签页
 * @returns {Promise<void>}
 */
const closeAllTabs = async () => {
  await delAllVisitedRoutes()
  await toLastTab()
  await closeMenu()
}

/**
 * 跳转最后一个标签页
 */
const toLastTab = async () => {
  const latestView = visitedRoutes.value.findLast((item:any) => item.path !== handleActivePath(route, true))
  if (latestView) await router.push(latestView)
  else await router.push('/')
}

const { x, y } = useMouse()

const openMenu = (item: any) => {
  left.value = x.value
  top.value = y.value
  hoverRoute.value = item
  hoverRoute.value.path = item.path
  visible.value = true
}

const closeMenu = () => {
  visible.value = false
  hoverRoute.value = null
}

watch(
  () => route.fullPath,
  () => {
    initNoCLosableTabs(routes.value)
    addTabs(route)
  },
  {
    immediate: true,
  }
)

onBeforeMount(() => {
  window.addEventListener('beforeunload', handleCaughtRoutes)
})

watchEffect(() => {
  if (visible.value) document.body.addEventListener('click', closeMenu)
  else document.body.removeEventListener('click', closeMenu)
})
</script>

<style lang="scss">
.vab-tabs-more-dropdown {
  width: 115px;

  &[data-popper-placement='bottom-end'] {
    .el-popper__arrow {
      left: 95px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.vab-tabs {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  min-height: var(--el-tabs-height);
  padding-right: var(--el-padding);
  padding-left: var(--el-padding);
  user-select: none;
  background: var(--el-color-white);

  :deep() {
    .fold-unfold {
      margin-right: var(--el-margin);
    }

    .el-tabs {
      &__nav-wrap::after {
        background: none;
      }

      &__item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: var(--el-padding) !important;
        padding-left: var(--el-padding) !important;

        .is-icon-close {
          width: 14px !important;
          margin-top: 1px;
          margin-right: 0 !important;

          svg {
            margin-right: 0 !important;
          }
        }
      }

      &__active-bar {
        display: none;
      }

      &__nav-next,
      &__nav-prev {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--el-tab-item-height);
      }
    }
  }

  &-content {
    width: calc(100% - 20px);

    &-card {
      height: var(--el-tab-item-height);

      :deep() {
        .el-tabs__header {
          .el-tabs__item {
            height: var(--el-tab-item-height);
            margin-right: 5px;
            border: 1px solid var(--el-border-color) !important;
            border-radius: var(--el-border-radius-base) !important;

            &.is-active {
              color: var(--el-color-primary);
              background: var(--el-color-primary-light-9);
            }
          }
        }
      }
    }

    &-smart {
      height: var(--el-tab-item-height);

      :deep() {
        .el-tabs__header {
          .el-tabs__item {
            height: var(--el-tab-item-height);
            margin-right: 5px;
            border: 0;
            border-top-left-radius: var(--el-border-radius-base);
            border-top-right-radius: var(--el-border-radius-base);

            &.is-active {
              background: var(--el-color-primary-light-9);
              outline: none;

              &:after {
                width: 100%;
                transition: var(--el-transition);
              }
            }

            &:after {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 0;
              height: 2px;
              content: '';
              background-color: var(--el-color-primary);
              transition: var(--el-transition);
            }

            &:hover {
              background: var(--el-color-primary-light-9);

              &:after {
                width: 100%;
                transition: var(--el-transition);
              }
            }
          }
        }
      }
    }

    &-smooth {
      height: var(--el-tab-item-height);

      :deep() {
        .el-tabs__nav {
          margin-top: 3.5px;
        }

        .el-tabs__header {
          .el-tabs__item {
            height: calc(var(--el-tab-item-height) + 4px);
            margin-right: -18px;

            &:hover {
              z-index: 999;
              color: var(--el-color-grey);
              background: var(--el-border-color);
              mask: url('/@/assets/tabs_images/vab-tab.png');
              mask-size: 100% 100%;
            }

            .vab-tabs-title {
              flex: 1;
              margin: 0 calc(var(--el-margin) / 2) 0 calc(var(--el-margin) / 2);
            }

            &.is-active {
              color: var(--el-color-primary);
              background: var(--el-color-primary-light-9);
              mask: url('/@/assets/tabs_images/vab-tab.png');
              mask-size: 100% 100%;

              &:hover {
                color: var(--el-color-primary);
                background: var(--el-color-primary-light-9);
                mask: url('/@/assets/tabs_images/vab-tab.png');
                mask-size: 100% 100%;
              }
            }
          }
        }
      }
    }

    &-rect {
      height: var(--el-tags-height);

      :deep() {
        .el-tabs__header {
          margin: -1px 0 0 0;

          .el-tabs__item {
            height: var(--el-tabs-height);

            &.is-active {
              background: var(--el-color-primary-light-9);
            }
          }

          .el-tabs__nav-prev,
          .el-tabs__nav-next {
            height: var(--el-tabs-height);
            line-height: var(--el-tabs-height);
          }
        }
      }
    }
  }

  .contextmenu {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    box-shadow: var(--el-box-shadow);

    i {
      margin-right: 3px;
    }

    .el-dropdown-menu__item:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }

  &-more {
    position: relative;
    box-sizing: border-box;
    display: block;
    text-align: left;

    &-active,
    &:hover {
      &:after {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 0;
        content: '';
      }

      .vab-tabs-more-icon {
        transform: rotate(90deg);

        .box-t {
          &:before {
            transform: rotate(45deg);
          }
        }

        .box:before,
        .box:after {
          background: var(--el-color-primary);
        }
      }
    }

    &-icon {
      display: inline-block;
      color: var(--el-color-grey);
      cursor: pointer;
      transition: transform 0.3s ease-out;

      .box {
        position: relative;
        display: block;
        width: 14px;
        height: 8px;

        &:before {
          position: absolute;
          top: 2px;
          left: 0;
          width: 6px;
          height: 6px;
          content: '';
          background: var(--el-color-grey);
        }

        &:after {
          position: absolute;
          top: 2px;
          left: 8px;
          width: 6px;
          height: 6px;
          content: '';
          background: var(--el-color-grey);
        }
      }

      .box-t {
        &:before {
          transition: transform 0.3s ease-out 0.3s;
        }
      }
    }
  }
}
</style>
