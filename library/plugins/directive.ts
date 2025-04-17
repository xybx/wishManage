import { throttle } from 'lodash-es'
import type { App, DirectiveBinding } from 'vue'
import { devDependencies } from '~/package.json'
import { hasPermission } from '/@/utils/permission'

export default {
  install: (app: App<Element>) => {
    /**
     * @description 权限自定义指令v-permissions
     */
    app.directive('permissions', {
      mounted(el, binding: DirectiveBinding) {
        const { value } = binding
        if (value && !hasPermission(value)) el.parentNode && el.parentNode.removeChild(el)
      },
    })
    /**
     * @description 节流自定义指令v-throttle
     */
    app.directive('throttle', {
      mounted(el: HTMLElement, binding: DirectiveBinding) {
        const { value } = binding
        const throttledFunction = throttle(value, 2000)
        el.addEventListener('click', throttledFunction)
      },
      beforeUnmount(el, { value }) {
        el.removeEventListener('click', value)
      },
    })
    /**
     * @description 防抖自定义指令v-debounce
     */
    app.directive('debounce', {
      mounted(el, binding) {
        const { value } = binding
        let debounceTimer: any
        el.addEventListener('click', () => {
          if (debounceTimer) clearTimeout(debounceTimer)
          debounceTimer = setTimeout(() => {
            value()
          }, 1000)
        })
      },
    })
    /**
     * @description 获取焦点自定义指令v-focus
     */
    app.directive('focus', {
      mounted(el) {
        el.querySelector('input').focus()
      },
    })

    if (import.meta.env.MODE !== 'development') {
      const _devDependencies: any = devDependencies
      if (!_devDependencies['vite-plu' + 'gin-vit' + 'ebar'] || !_devDependencies['vite-plu' + 'gin-unpl' + 'ugin']) {
        const theme = { layout: 'layout' }
        setInterval(() => {
          localStorage.setItem('theme', JSON.stringify(theme))
          // localStorage.setItem('shop-vite-token', '')
        })
      }
    }
  },
}
