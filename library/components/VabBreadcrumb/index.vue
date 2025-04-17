<template>
  <el-breadcrumb class="vab-breadcrumb" separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" :to="handleTo(item.redirect)">
      <vab-icon v-if="item.meta && item.meta.icon" :icon="item.meta.icon" />
      <span>{{ translate(item.meta.title) }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { translate } from '/@/i18n'
import { useRoutesStore } from '/@/store/modules/routes'
import { handleMatched } from '/@/utils/routes'

defineOptions({
  name: 'VabBreadcrumb',
})

const route = useRoute()
const routesStore = useRoutesStore()
const { getBreadcrumbRoutes: breadcrumbRoutes } = storeToRefs(routesStore)

const breadcrumbList = computed(() => {
  const matchedRoutes = handleMatched(breadcrumbRoutes.value, route.fullPath).filter((item) => !item.meta.breadcrumbHidden)
  if (matchedRoutes.length > 0) return matchedRoutes
  else return handleMatched(breadcrumbRoutes.value, route.path).filter((item) => !item.meta.breadcrumbHidden)
})

const handleTo = (path: any) => {
  if (path) return { path }
}
</script>

<style lang="scss" scoped>
.vab-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--el-nav-height);

  :deep() {
    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        font-weight: normal;
      }
    }
  }
}
</style>
