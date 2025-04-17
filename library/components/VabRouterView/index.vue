<template>
  <router-view v-slot="{ Component }">
    <transition mode="out-in" :name="theme.pageTransition">
      <keep-alive :include="keepAliveNameList" :max="keepAliveMaxNum">
        <component :is="Component" :key="routerKey" ref="componentRef" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { useHead } from '@vueuse/head'
import VabProgress from 'nprogress'
import { keepAliveMaxNum } from '/@/config'
import { useSettingsStore } from '/@/store/modules/settings'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'

defineOptions({
  name: 'VabRouterView',
})

const route = useRoute()
const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
const tabsStore = useTabsStore()
const { getVisitedRoutes: visitedRoutes } = storeToRefs(tabsStore)
const componentRef = ref<any>()
const routerKey = ref<any>()
const keepAliveNameList = ref<any>()
const siteData = reactive<any>({
  description: '',
})

useHead({
  meta: [
    {
      name: `description`,
      content: computed(() => siteData.description),
    },
  ],
})

const updateKeepAliveNameList = (refreshRouteName = null) => {
  keepAliveNameList.value = visitedRoutes.value
    .filter((item:any) => !item.meta.noKeepAlive && item.name !== refreshRouteName)
    .flatMap((item:any) => item.name)
}

// 更新KeepAlive缓存页面
watchEffect(() => {
  routerKey.value = handleActivePath(route, true)
  updateKeepAliveNameList()
  siteData.description = `${'Vue'} ${'Shop'} ${'Vite'}-${route.meta.title}简介、官网、首页、文档和下载 - 前端开发框架`
})

onBeforeMount(() => {
  $sub('reload-router-view', (refreshRouteName: any = route.name) => {
    if (theme.value.showProgressBar) VabProgress.start()
    const cacheActivePath = routerKey.value
    routerKey.value = null
    updateKeepAliveNameList(refreshRouteName)
    nextTick(() => {
      routerKey.value = cacheActivePath
      updateKeepAliveNameList()
    })
    setTimeout(() => {
      if (theme.value.showProgressBar) VabProgress.done()
    }, 200)
  })
})
</script>
