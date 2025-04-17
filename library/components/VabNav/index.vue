<template>
  <div class="vab-nav" :class="{'hanv':custom}">
    <div class="left-panel">
      <vab-logo v-if="custom" class="fixed-logo" />
      <vab-fold fold="contract-left-line" unfold="contract-right-line" />
      <el-tabs
        v-if="layout === 'comprehensive'"
        v-model="tab.data"
        class="comprehensive-tabs"
        tab-position="top"
        @tab-click="handleTabClick"
      >
        <template v-for="(item, index) in routes" :key="index + item.name">
          <el-tab-pane :name="item.name">
            <template #label>
              <vab-icon v-if="item.meta.icon" :icon="item.meta.icon" :is-custom-svg="item.meta.isCustomSvg" />
              {{ translate(item.meta.title) }}
            </template>
          </el-tab-pane>
        </template>
      </el-tabs>
      <vab-breadcrumb v-else class="hidden-xs-only hidden-md-and-down" />
    </div>

    <div class="right-panel">
      <vab-right-tools />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openFirstMenu } from '/@/config'
import { translate } from '/@/i18n'
import { useRoutesStore } from '/@/store/modules/routes'
import { isExternal } from '/@/utils/validate'

defineOptions({
  name: 'VabNav',
})

defineProps({
  layout: {
    type: String,
    default: '',
  },
  custom:{
    type: Boolean,
    default: false,
  }
})

const router = useRouter()
const routesStore = useRoutesStore()
const { getTab: tab, getTabMenu: tabMenu, getRoutes: routes } = storeToRefs(routesStore)

const handleTabClick = () => {
  nextTick(() => {
    if (isExternal(tabMenu.value.path)) {
      window.open(tabMenu.value.path)
      router.push('/redirect')
    } else if (openFirstMenu) router.push(tabMenu.value.redirect || tabMenu.value)
  })
}
</script>

<style lang="scss">
.vab-layout-comprehensive {
  .comprehensive-tabs {
    width: calc(100vw - var(--el-left-menu-width) - 675px) !important;
  }
}
</style>
<style lang="scss" scoped>
.vab-nav {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: var(--el-nav-height);
  padding-right: var(--el-padding);
  padding-left: var(--el-padding);
  overflow: hidden;
  user-select: none;
  background: var(--el-color-white);
  border-bottom: 1px solid var(--el-border-color);
  &.hanv{
    height:80px;
    background: url('/@/assets/login/topbg.png') top center no-repeat;
    background-size:100% 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: calc(var(--el-z-index) - 1);
    .left-panel{
      width:800px;
      height:100%;
      :deep(.fold-unfold){
        color: #fff;
        font-size:20px;
      }
      :deep(.el-breadcrumb__item){
        font-size:16px;
      }
      :deep(.el-breadcrumb__inner){
        color: #fff;
        i{
          font-size:18px;
        }
      }
      :deep(.el-breadcrumb__separator){
        color: #fff;
      }
    }
    .right-panel{
      height:100%;
      :deep(){
        [class*='ri-'] {
          color: #fff;
        }
        .el-dropdown{
          color: #fff;
          .el-avatar{
            background-color: #FFFFFF!important;
          }
        }
      }
    }
    .fixed-logo{
      width:50%;
      margin-right: 20px;
      text-align: left;
      :deep(.title){
        font-size:36px;
        font-weight:bold;
        text-shadow: 0px 7px 1px rgba(52,64,88,0.35);
      }
    }
  }
  .left-panel {
    display: flex;
    align-items: center;
    justify-items: center;
    height: var(--el-nav-height);

    :deep() {
      .fold-unfold {
        margin-right: var(--el-margin);
      }

      .el-tabs {
        width: 100%;
        margin-left: 0;

        .el-tabs__header {
          margin: 0;

          > .el-tabs__nav-wrap {
            display: flex;
            align-items: center;

            .el-icon-arrow-left,
            .el-icon-arrow-right {
              font-weight: 600;
              color: var(--el-color-grey);
            }
          }
        }

        .el-tabs__item {
          > div {
            display: flex;
            align-items: center;

            i {
              margin-right: 3px;
            }
          }
        }
      }

      .el-tabs__nav-wrap::after {
        display: none;
      }
    }
  }

  .right-panel {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: flex-end;
    height: var(--el-nav-height);
    transition: var(--el-transition);

    :deep() {
      [class*='ri-'] {
        margin-left: var(--el-margin);
        color: var(--el-color-grey);
        cursor: pointer;
      }

      button {
        [class*='ri-'] {
          margin-left: 0;
          color: var(--el-color-white);
          cursor: pointer;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .right-panel {
      :deep() {
        .el-badge,
        .ri-refresh-line {
          display: none;
        }
      }
    }
  }
}
</style>
