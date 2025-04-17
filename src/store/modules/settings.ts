/**
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */

import {
  persistenceTab as _persistenceTab,
  color,
  colorWeakness,
  columnStyle,
  fixedHeader,
  foldSidebar,
  i18n,
  isFollow,
  layout,
  logo,
  menuWidth,
  pageTransition,
  radius,
  showColorPicker,
  showDark,
  showFooter,
  showFullScreen,
  showLanguage,
  showLock,
  showProgressBar,
  showRefresh,
  showTabs,
  showTabsIcon,
  showTheme,
  showThemeSetting,
  tabsBarStyle,
  themeName,
  title,
  showAvatar,
} from '/@/config'
import { colorRgba, lightenColorChrome } from '/@/utils/lightenColor'
import { getLocalStorage } from '/@/utils/localStorage'

const defaultTheme: ThemeType = {
  color,
  colorWeakness,
  columnStyle,
  fixedHeader,
  foldSidebar,
  isFollow,
  layout,
  menuWidth,
  pageTransition,
  radius,
  showColorPicker,
  showDark,
  showFooter,
  showFullScreen,
  showLanguage,
  showLock,
  showProgressBar,
  showRefresh,
  showTabs,
  showTabsIcon,
  showTheme,
  showThemeSetting,
  tabsBarStyle,
  themeName,
  showAvatar,
}

const { collapse = foldSidebar } = getLocalStorage('collapse')
const { persistenceTab = _persistenceTab } = getLocalStorage('persistenceTab')

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsModuleType => ({
    collapse,
    color: getLocalStorage('color').color || color,
    device: 'desktop',
    language: getLocalStorage('language').language || i18n,
    lock: getLocalStorage('lock').lock || false,
    logo: getLocalStorage('logo').logo || logo,
    mode: localStorage.getItem('vueuse-color-scheme') || 'light',
    persistenceTab,
    theme: { ...defaultTheme, ...getLocalStorage('shop-vite-theme') } || {
      ...defaultTheme,
    },
    title: getLocalStorage('title').title || title,
  }),
  getters: {
    getCollapse: (state) => state.collapse,
    getColor: (state) => state.color,
    getDevice: (state) => state.device,
    getPersistenceTab: (state) => state.persistenceTab,
    getLanguage: (state) => state.language,
    getLock: (state) => state.lock,
    getLogo: (state) => state.logo,
    getMode: (state) => state.mode,
    getTheme: (state) => state.theme,
    getTitle: (state) => state.title,
  },
  actions: {
    updateState(obj: any) {
      Object.getOwnPropertyNames(obj).forEach((key) => {
        // @ts-ignore
        this[key] = obj[key]
        localStorage.setItem(key, typeof obj[key] == 'string' ? `{"${key}":"${obj[key]}"}` : `{"${key}":${obj[key]}}`)
      })
    },
    updateMode(value: any) {
      this.mode = value
    },
    saveTheme() {
      localStorage.setItem('shop-vite-theme', JSON.stringify(this.theme))
    },
    resetTheme() {
      this.theme = { ...defaultTheme }
      this.persistenceTab = _persistenceTab
      this.changeLanguage(i18n)
      if (this.device === 'mobile')
        this.theme = {
          ...defaultTheme,
          layout: 'vertical',
        }
      localStorage.removeItem('shop-vite-theme')
      this.updateTheme()
    },
    updateTheme() {
      document.querySelectorAll('body')[0].className = `vab-theme-${this.theme.themeName}`

      if (this.theme.themeName === 'default') {
        const colorScheme = localStorage.getItem('vueuse-color-scheme')
        const htmlElement = document.querySelectorAll('html')[0]
        htmlElement.className += ` ${colorScheme}`
        this.mode = colorScheme as string
      } else {
        document.querySelectorAll('html')[0].className = ''
        localStorage.setItem('vueuse-color-scheme', 'light')
        this.mode = 'light'
      }

      this.setCssVar()
    },
    setCssVar() {
      const el = ref<HTMLElement | null>(null)

      if (this.theme.menuWidth && this.theme.menuWidth.endsWith('px')) useCssVar('--el-left-menu-width', el).value = this.theme.menuWidth
      else useCssVar('--el-left-menu-width', el).value = '266px'

      if (this.theme.showTabs) {
        useCssVar('--el-tabs-height', el).value = '50px'
      } else {
        useCssVar('--el-tabs-height', el).value = '0px'
      }

      if (this.theme.showFooter) {
        useCssVar('--el-footer-height', el).value = '50px'
      } else {
        useCssVar('--el-footer-height', el).value = '-20px'
      }

      if (this.theme.radius) {
        useCssVar('--el-border-radius-base', el).value = `${this.theme.radius}px`
      } else {
        useCssVar('--el-border-radius-base', el).value = '5px'
      }

      if (this.theme.isFollow) {
        useCssVar('--el-menu-background-color', el).value = lightenColorChrome(this.color, 18)
      } else {
        useCssVar('--el-menu-background-color', el).value = '#282c34'
      }

      if (this.theme.colorWeakness) document.querySelectorAll('body')[0].classList.add('color-weakness')
      else document.querySelectorAll('body')[0].classList.remove('color-weakness')
    },
    toggleCollapse() {
      this.collapse = !this.collapse
      localStorage.setItem('collapse', `{"collapse":${this.collapse}}`)
    },
    toggleDevice(device: string) {
      this.updateState({ device })
    },
    openSideBar() {
      this.updateState({ collapse: false })
    },
    foldSideBar() {
      this.updateState({ collapse: true })
    },
    changeLanguage(language: string) {
      this.updateState({ language })
    },
    handleLock() {
      this.updateState({ lock: true })
    },
    handleUnLock() {
      this.updateState({ lock: false })
    },
    updateCaughtTabs(value: any) {
      this.updateState({ persistenceTab: value })
      if (!value) localStorage.removeItem('caughtRoutes')
    },
    changeLogo(logo: string) {
      this.updateState({ logo })
    },
    changeTitle(title: string) {
      this.updateState({ title })
    },
    changeColor() {
      this.setCssVar()
      const el = ref<HTMLElement | null>(null)
      useCssVar('--el-color-primary-dark-2', el).value = this.color
      useCssVar('--el-color-primary', el).value = this.color
      for (let index = 1; index < 10; index++) {
        useCssVar(`--el-color-primary-light-${index}`, el).value = colorRgba(this.color, 1 - index * 0.1)
      }
      this.updateState({ color: this.color })
    },
  },
})
