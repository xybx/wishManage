<template>
  <div
    class="vab-fall-bar"
    :class="{
      'is-collapse': collapse,
    }"
  >
    <vab-logo style="z-index: 999" />
    <fall-menu :data="handleRoutes">
      <template #level1="{ slotScope }">
        <a :title="translate(slotScope.meta.title)" @click="handleLink(slotScope)">
          <vab-icon :icon="slotScope.meta && slotScope.meta.icon" />
          <span>{{ translate(slotScope.meta.title) }}</span>
          <vab-icon v-if="slotScope.children" class="fall-icon-right" icon="arrow-right-s-line" />
        </a>
      </template>
      <template #level2="{ slotScope }">
        <span style="cursor: pointer" @click="handleLink(slotScope)">
          <vab-icon :icon="slotScope.meta && slotScope.meta.icon" />
          <span>{{ translate(slotScope.meta.title) }}</span>
        </span>
      </template>
      <template #level3="{ slotScope }">
        <a v-for="(level3, index) in slotScope" :key="index" :href="level3.url" @click="handleLink(level3)">
          - {{ translate(level3.meta.title) }}
          <el-tag v-if="level3.meta && level3.meta.badge" effect="dark" size="small" type="danger">
            {{ level3.meta.badge }}
          </el-tag>
          <span v-if="level3.meta && level3.meta.dot" class="vab-dot vab-dot-error">
            <span></span>
          </span>
        </a>
      </template>
    </fall-menu>
  </div>
</template>

<script lang="ts" setup>
/**
 * @author:zxwk-sundan
 * @description:瀑布菜单最多支持到三级菜单，不支持左侧点击选中，且非element-plus官方组件，生产环境请谨慎使用
 */

import { FallMenu } from '@opentiny/vue'
import { isHashRouterMode } from '/@/config'
import { translate } from '/@/i18n'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'
import { isExternal } from '/@/utils/validate'
defineOptions({
  name: 'VabFallBar',
})

const settingsStore = useSettingsStore()
const routesStore = useRoutesStore()
const { getRoutes: routes } = storeToRefs(routesStore)
const route = useRoute()
const router = useRouter()

const { device, collapse } = storeToRefs(settingsStore)
const { foldSideBar } = settingsStore
const { enter, exit } = useFullscreen()
const mousePosition = ref({ x: 0, y: 0 })

const handleRoutes = computed(() =>
  routes.value.flatMap((route: any) => (route.meta.levelHidden && route.children ? [...route.children] : route))
)

const handleLink = (slotScope: any) => {
  nextTick(() => {
    const routePath = slotScope.path
    const target = slotScope.meta.target
    const fullscreen = slotScope.meta.fullscreen

    if (target === '_blank') {
      if (isExternal(routePath)) {
        window.open(routePath)
        router.push('/redirect')
      } else if (route.path !== routePath) isHashRouterMode ? window.open(`#${routePath}`) : window.open(routePath)
      router.push('/redirect')
    } else {
      if (isExternal(routePath)) window.location.href = routePath
      else if (route.path === routePath) {
        $pub('reload-router-view')
      } else {
        if (device.value === 'mobile') foldSideBar()
        if (slotScope.children) router.push(slotScope.redirect)
        else router.push(slotScope.path)
      }
    }

    setTimeout(() => {
      if (fullscreen) enter()
      else exit()
    }, 1000)
  })
}

useEventListener('mousemove', (e: MouseEvent) => {
  mousePosition.value = {
    x: e.clientX,
    y: e.clientY,
  }
  if ((mousePosition.value.x < 265 && !collapse.value) || (mousePosition.value.x < 65 && collapse.value)) {
    const element: any = document.querySelector('.vab-fall-bar .tiny-fall-menu__box')
    const base = 60
    const intervalSize = 48
    for (let i = 0; i < 10; i++) {
      const lowerBound = base + i * intervalSize
      const upperBound = lowerBound + intervalSize
      if (mousePosition.value.y > lowerBound && mousePosition.value.y < upperBound) {
        mousePosition.value.y = lowerBound - 60
        break
      }
    }
    element.style.top = `${mousePosition.value.y}px`
  }
})
</script>

<style lang="scss" scoped>
.vab-fall-bar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: var(--el-z-index);
  width: calc(var(--el-left-menu-width) - 1px);
  background: var(--el-menu-background-color);
  border-right: 1px solid var(--el-border-color);

  .fall-icon-right {
    float: right;
  }

  :deep() {
    .tiny-fall-menu {
      --ti-fall-menu-bg-color-normal: var(--el-menu-background-color);
      --ti-fall-menu-bg-color-hover: var(--el-color-primary);
      --ti-fall-menu-slot-bg-color: var(--el-menu-background-color);
      --ti-fall-menu-box-text-color: var(--el-color-white);
      --ti-fall-menu-slot-text-color: var(--el-color-white);
      --ti-common-font-size-base: 14px;
      --ti-fall-menu-title-font-size: 14px;
      --ti-fall-menu-box-width: 560px;

      &__nav {
        height: calc(var(--vh, 1vh) * 100);
      }

      &__wrap {
        padding: 0;
        background: var(--ti-fall-menu-bg-color-normal);
      }

      &__subnav {
        .icon-slot-left,
        .icon-slot-right {
          opacity: 0;
        }
      }

      &__list {
        right: 0 !important;
        left: 0 !important;
        min-width: 100%;

        li {
          display: block;
          float: none;
          width: 100%;

          a {
            display: block;
            width: calc(100% - 20px);
            margin: 0 10px 0px 10px !important;
            text-align: left;
            border-radius: var(--el-border-radius-base);

            [class*='ri-'] {
              margin-left: 1.5px;
            }

            [class*='ri-'] + span {
              padding-left: 3px;
            }
          }
        }

        .fall-hide {
          opacity: 1;
        }
      }

      &__box {
        top: 5px;
        left: var(--el-left-menu-width);
        min-width: var(--ti-fall-menu-box-width);
        padding: var(--el-padding);
        overflow-y: auto;
        border: 0;
        border-radius: var(--el-border-radius-base);
        box-shadow: none;
        transition:
          all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
          top 0.1s !important;

        .cont {
          padding: 0;
        }

        .sublist {
          li {
            h3.mcate-item-hd {
              color: var(--ti-fall-menu-box-title-text-color);

              [class*='ri-'] + span {
                padding-left: 3px;
              }

              &:hover {
                color: var(--el-color-primary) !important;
              }
            }

            p.mcate-item-bd {
              a {
                font-size: 13px;
                color: var(--ti-fall-menu-box-text-color);

                &:hover {
                  color: var(--el-color-primary) !important;
                }

                .el-tag {
                  height: 16px;
                  padding: 0 5px 0 5px;
                }
              }
            }
          }
        }
      }
    }
  }

  &.is-collapse {
    width: 65px;

    :deep() {
      .tiny-fall-menu {
        &__list {
          li {
            a {
              [class*='ri-'] + span {
                display: none;
              }
            }
          }

          .fall-hide {
            opacity: 1;
          }
        }

        &__box {
          left: calc(var(--el-left-menu-width-min) + 2px);
          padding-right: 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.vab-theme-technology {
  .tiny-fall-menu {
    --ti-fall-menu-bg-color-normal: var(--el-menu-background-color);
    --ti-fall-menu-bg-color-hover: var(--el-color-primary);
    --ti-fall-menu-slot-bg-color: var(--el-menu-background-color);
    --ti-fall-menu-box-text-color: #fff !important;
    --ti-fall-menu-slot-text-color: var(--el-color-white);

    &__list {
      a {
        color: #fff;
      }
    }

    &__box {
      border: 1px solid var(--el-border-color) !important;

      .sublist {
        li {
          h3.mcate-item-hd {
            color: var(--ti-fall-menu-box-title-text-color);
          }

          p.mcate-item-bd {
            a {
              color: var(--ti-fall-menu-box-text-color);
            }
          }
        }
      }
    }
  }
}

.vab-theme-plain {
  .tiny-fall-menu {
    --ti-fall-menu-bg-color-normal: var(--el-menu-background-color);
    --ti-fall-menu-bg-color-hover: var(--el-color-primary);
    --ti-fall-menu-slot-bg-color: var(--el-menu-background-color);
    --ti-fall-menu-box-text-color: var(--el-color-grey) !important;
    --ti-fall-menu-slot-text-color: var(--el-color-grey) !important;

    &__box {
      border: 1px solid var(--el-border-color) !important;

      .sublist {
        li {
          h3.mcate-item-hd {
            color: #515a6e !important;
          }

          p.mcate-item-bd {
            a {
              color: var(--ti-fall-menu-box-text-color);
            }
          }
        }
      }
    }

    &__list {
      a:hover {
        color: #fff !important;
      }
    }
  }
}

.dark {
  .tiny-fall-menu {
    --ti-fall-menu-bg-color-normal: var(--el-menu-background-color);
    --ti-fall-menu-bg-color-hover: var(--el-color-primary);
    --ti-fall-menu-slot-bg-color: var(--el-menu-background-color);
    --ti-fall-menu-box-text-color: var(--el-color-grey) !important;
    --ti-fall-menu-slot-text-color: var(--el-color-grey) !important;

    &__box {
      border: 1px solid var(--el-border-color) !important;

      .sublist {
        li {
          h3.mcate-item-hd {
            color: #fff !important;
          }

          p.mcate-item-bd {
            a {
              color: var(--ti-fall-menu-box-text-color);
            }
          }
        }
      }
    }

    &__list {
      a:hover {
        color: #fff !important;
      }
    }
  }
}
</style>
