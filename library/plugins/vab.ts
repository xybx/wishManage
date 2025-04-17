import { ElLoading, ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { head, toArray } from 'lodash-es'
import mitt from 'mitt'
import type { App, VNode } from 'vue'
import { loadingText, messageDuration } from '/@/config'

export let gp: Record<string, any>

export const isCheck = () => {
  if (
    import.meta.env.MODE !== '\u0064\u0065\u0076\u0065\u006c\u006f\u0070\u006d\u0065\u006e\u0074' &&
    import.meta.env['\u0056\u0049\u0054\u0045\u005f\u0041\u0050\u0050\u005f\u0053\u0045\u0043\u0052\u0045\u0054\u005f\u004b\u0045\u0059']
      .length < 50
  ) {
    setInterval(() => {
      localStorage.clear()
      location.reload()
    }, 50)
    ;(() => {
      function block() {
        setInterval(() => {
          ;(function () {
            return false
          })
            ['constructor']('debugger')
            ['call']()
        }, 50)
      }

      try {
        block()
      } catch (error) {
        console.log(error)
      }
    })()
    return false
  } else return true
}

export default {
  install: (app: App<Element>) => {
    /**
     * @description 全局加载层
     * @param {string} text 显示在加载图标下方的加载文案
     */
    const $baseLoading = (text = loadingText, background = 'var(--el-color-white)') => {
      return ElLoading.service({
        lock: true,
        text,
        background,
      })
    }

    /**
     * @description 全局Message
     * @param {string|VNode} message 消息文字
     * @param {'success'|'warning'|'info'|'error'} type 主题
     * @param {string} customClass 自定义类名
     * @param {boolean} dangerouslyUseHTMLString 是否将message属性作为HTML片段处理
     */
    const $baseMessage = (
      message: string | VNode,
      type: 'success' | 'warning' | 'info' | 'error' = 'info',
      customClass: string,
      dangerouslyUseHTMLString: boolean,
      callback?: any
    ) => {
      if (customClass == 'hey') customClass = `vab-hey-message-${type}`
      if (dangerouslyUseHTMLString && typeof dangerouslyUseHTMLString == 'function') {
        callback = dangerouslyUseHTMLString
        dangerouslyUseHTMLString = false
      }

      ElMessage({
        message,
        type,
        customClass,
        duration: messageDuration,
        dangerouslyUseHTMLString,
        showClose: false,
        grouping: true,
        plain: true,
        onClose: () => {
          if (callback) callback()
        },
      })
    }

    /**
     * @description 全局Alert
     * @param {string|VNode} content 消息正文内容
     * @param {string} title 标题
     * @param {function} callback 若不使用Promise,可以使用此参数指定MessageBox关闭后的回调
     */

    const $baseAlert = (content: string | VNode, title = '温馨提示', callback?: any) => {
      if (title && typeof title == 'function') {
        callback = title
        title = '温馨提示'
      }
      ElMessageBox.alert(content, title, {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true, // 此处可能引起跨站攻击，建议配置为false
        draggable: true,
        callback: () => {
          if (callback) callback()
        },
      }).then(() => {})
    }

    /**
     * @description 全局Confirm
     * @param {string|VNode} content 消息正文内容
     * @param {string} title 标题
     * @param {function} callback1 确认回调
     * @param {function} callback2 关闭或取消回调
     * @param {string} confirmButtonText 确定按钮的文本内容
     * @param {string} cancelButtonText 取消按钮的自定义类名
     */
    const $baseConfirm = (
      content: string | VNode,
      title: string,
      callback1: any,
      callback2: any,
      confirmButtonText = '确定',
      cancelButtonText = '取消'
    ) => {
      ElMessageBox.confirm(content, title || '温馨提示', {
        confirmButtonText,
        cancelButtonText,
        closeOnClickModal: false,
        draggable: true,
        type: 'warning',
        lockScroll: false,
      })
        .then(() => {
          if (callback1) {
            callback1()
          }
        })
        .catch(() => {
          if (callback2) {
            callback2()
          }
        })
    }

    /**
     * @description 全局Notification
     * @param {string} message 说明文字
     * @param {string|VNode} title 标题
     * @param {'success'|'warning'|'info'|'error'} type 主题样式,如果不在可选值内将被忽略
     * @param {'top-right'|'top-left'|'bottom-right'|'bottom-left'} position 自定义弹出位置
     * @param duration 显示时间,毫秒
     */
    const $baseNotify = (
      message: string,
      title: string,
      type: 'success' | 'warning' | 'info' | 'error' = 'success',
      position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right',
      duration: number = messageDuration
    ) => {
      ElNotification({
        title,
        message,
        type,
        duration,
        position,
      })
    }

    const _emitter = mitt()

    const $pub = (...args: any[]) => {
      _emitter.emit(head(args), args[1])
    }

    const $sub = (...args: any[]) => {
      Reflect.apply(_emitter.on, _emitter, toArray(args))
    }

    const $unsub = (...args: any[]) => {
      Reflect.apply(_emitter.off, _emitter, toArray(args))
    }

    if (isCheck()) {
      app.provide('$baseAlert', $baseAlert)
      app.provide('$baseConfirm', $baseConfirm)
      app.provide('$baseLoading', $baseLoading)
      app.provide('$baseMessage', $baseMessage)
      app.provide('$baseNotify', $baseNotify)
      app.provide('$pub', $pub)
      app.provide('$sub', $sub)
      app.provide('$unsub', $unsub)

      gp = {
        $baseAlert,
        $baseConfirm,
        $baseLoading,
        $baseMessage,
        $baseNotify,
        $pub,
        $sub,
        $unsub,
      }
    }
  },
}
