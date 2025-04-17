<template>
  <div v-if="theme.showThemeSetting" class="vab-theme-setting">
    <el-collapse-transition>
      <section v-show="show">
        <div v-show="routeName !== 'SeparateLayout'" @click="randomTheme">
          <a>
            <vab-icon icon="fire-line" />
            <p>{{ translate('随机换肤') }}</p>
          </a>
        </div>
        <div v-show="routeName !== 'SeparateLayout'" @click="handleOpenTheme">
          <a>
            <vab-icon icon="t-shirt-line" />
            <p>{{ translate('主题配置') }}</p>
          </a>
        </div>
        <div @click="changeTheme('technology')">
          <a>
            <vab-icon icon="user-5-line" />
            <p>
              {{ translate('科技主题') }}
            </p>
          </a>
        </div>
        <div @click="changeTheme('plain')">
          <a>
            <vab-icon icon="computer-line" />
            <p>
              {{ translate('简洁主题') }}
            </p>
          </a>
        </div>
        <div @click="resetTheme">
          <a>
            <vab-icon icon="arrow-go-back-line" />
            <p>
              {{ translate('默认主题') }}
            </p>
          </a>
        </div>
        <div @click="removeLocalStorage">
          <a>
            <vab-icon icon="delete-bin-4-line" />
            <p>
              {{ translate('清理缓存') }}
            </p>
          </a>
        </div>
      </section>
    </el-collapse-transition>

    <div class="vab-buy-box" @click="buy">
      <a class="vab-buy">
        <vab-icon icon="shopping-cart-2-line" />
        <p>{{ translate('购买源码') }}</p>
      </a>
    </div>
    <div class="vab-show-hide-box" @click="toggleShowHide">
      <a>
        <vab-icon :icon="show ? 'arrow-up-double-line' : 'arrow-down-double-line'" />
        <p>
          {{ translate(show ? '收起浮窗' : '展开浮窗') }}
        </p>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { translate } from '/@/i18n'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabThemeSetting',
})

const settingsStore = useSettingsStore()
const { device, color, theme } = storeToRefs(settingsStore)
const { changeColor, saveTheme, updateTheme, setCssVar } = settingsStore
const show = ref<boolean>(true)
const route = useRoute()
const routeName = ref<any>(route.name)

const handleOpenTheme = () => {
  $pub('shop-vite-open-theme')
}

const buy = () => {
  window.open('https://vue-admin-beautiful.com/authorization/shop-vite.html')
}

const removeLocalStorage = () => {
  localStorage.clear()
  location.reload()
}

const resetTheme = () => {
  $pub('shop-vite-reset-theme')
}

const changeTheme = (value: string) => {
  $pub('shop-vite-change-theme', value)
  $pub('shop-vite-save-theme')
}

const toggleShowHide = () => {
  show.value = !show.value
}

const shuffle = (val: any, list: any) => list.filter((item: any) => item !== val)[(Math.random() * (list.length - 1)) | 0]

const randomTheme = async () => {
  const loading = $baseLoading()

  setTimeout(() => {
    const themeName = shuffle(theme.value.themeName, ['default', 'plain', 'technology'])
    const columnStyle = shuffle(theme.value.columnStyle, ['vertical', 'horizontal', 'card', 'arrow', 'semicircle'])
    const tabsBarStyle = shuffle(theme.value.tabsBarStyle, ['card', 'smart', 'smooth', 'rect'])
    const showTabsIcon = shuffle(theme.value.showTabsIcon, [true, false])
    const layout =
      device.value === 'desktop' ? shuffle(theme.value.layout, ['horizontal', 'vertical', 'column', 'comprehensive', 'fall']) : 'vertical'
    const _color = shuffle(color.value, [
      '#1e90ff',
      '#4e88f3',
      '#0052d9',
      '#3fb884',
      '#16baa9',
      '#07c160',
      '#009688',
      '#6954f0',
      '#7b40f2',
      '#f01414',
    ])
    const isFollow = shuffle(theme.value.isFollow, [true, false])

    theme.value.themeName = themeName
    theme.value.columnStyle = columnStyle
    theme.value.tabsBarStyle = tabsBarStyle
    theme.value.showTabsIcon = showTabsIcon
    theme.value.layout = layout

    if (themeName === 'technology') {
      color.value = '#4e88f3'
    } else {
      color.value = _color
    }

    if (themeName === 'default') theme.value.isFollow = isFollow
    else theme.value.isFollow = false

    changeColor()
    setCssVar()
    updateTheme()
    saveTheme()
    setTimeout(() => {
      loading.close()
      $baseMessage('切换成功', 'success', 'hey')
    }, 1000)
  }, 100)
}

watch(
  route,
  () => {
    routeName.value = route.name
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.vab-theme-setting {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: calc(var(--el-z-index) - 1);
  padding: 10px 0 0 0;
  margin: 0;
  text-align: center;
  cursor: pointer;
  background: var(--el-color-white);
  border-top: 1px solid var(--el-border-color);
  border-bottom: 1px solid var(--el-border-color);
  border-left: 1px solid var(--el-border-color);
  border-top-left-radius: var(--el-border-radius-base);
  border-bottom-left-radius: var(--el-border-radius-base);
  box-shadow: 0 0 50px 0 rgb(82 63 105 / 15%);
  transform: translateY(-50%);

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px 10px 10px;
    margin: 0;
    list-style: none;

    &:nth-child(n) {
      a {
        &:hover {
          color: var(--el-color-white);
        }
      }
    }

    &:nth-child(1),
    &:nth-child(3),
    &:nth-child(4) {
      a {
        color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);

        &:hover {
          background: var(--el-color-primary);
        }
      }
    }

    &:nth-child(2),
    &:nth-child(5) {
      a {
        color: var(--el-color-success);
        background: var(--el-color-success-lighter);

        &:hover {
          background: var(--el-color-success);
        }
      }
    }

    &:nth-child(4) {
      a {
        color: var(--el-color-info);
        background: var(--el-color-info-lighter);

        &:hover {
          background: var(--el-color-info);
        }
      }
    }

    &:nth-child(6) {
      a {
        color: var(--el-color-danger);
        background: var(--el-color-danger-lighter);

        &:hover {
          background: var(--el-color-danger);
        }
      }
    }

    a {
      display: inline-block;
      width: 55px;
      height: 55px;
      padding-top: 10px;
      text-align: center;
      background: var(--el-color-white);
      border-radius: var(--el-border-radius-base);

      p {
        padding: 0;
        margin: 0;
        overflow: hidden;
        font-size: var(--el-font-size-small);
        line-height: 25px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .vab-buy-box {
    a {
      color: var(--el-color-warning) !important;
      background: var(--el-color-warning-lighter) !important;

      &:hover {
        color: var(--el-color-white) !important;
        background: var(--el-color-warning) !important;
      }
    }
  }

  .vab-show-hide-box {
    a {
      color: var(--el-color-primary) !important;
      background: var(--el-color-primary-light-9) !important;

      &:hover {
        color: var(--el-color-white) !important;
        background: var(--el-color-primary) !important;
      }
    }
  }
}
</style>
