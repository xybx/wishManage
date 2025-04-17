<template>
  <vab-app />
</template>

<script lang="ts" setup>
import { noDebugger } from '/@/config'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'App',
})

const settingsStore = useSettingsStore()
// const { updateTheme, changeColor } = settingsStore

const resizeContainer = () => {
  let vh = window.innerHeight * 0.01
  const el = ref<HTMLElement | null>(null)
  useCssVar('--vh', el).value = `${vh}px`
}

onBeforeMount(() => {
// let userinfo = sessionStorage.getItem("userinfo");
  // if (userinfo) {
  //   const ws = new WebSocket(
  //     `ws://192.168.1.190:8110/appa/websocket/${JSON.parse(userinfo).pid}`
  //   );
  //   //连接发生错误的回调方法
  //   ws.onerror = function () {
  //     console.log("ws连接发生错误");
  //   };
  //   //连接成功建立的回调方法
  //   ws.onopen = function () {
  //     console.log("ws连接成功");
  //   };
  // }

  /**
   * @description: 修复ios、android等移动端浏览器100vh兼容问题
   * @author sundan
   */

  window.addEventListener('orientationchange', resizeContainer)
  window.addEventListener('resize', resizeContainer)
  resizeContainer()

  // 是否允许生产环境进行代码调试，请前往config/cli.config.ts文件配置
  if( !location.hostname.includes("127") && !location.hostname.includes("localhost")){
    if (noDebugger) {
      ;(() => {
        const block = () => {
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
        } catch {
          /* empty */
        }
      })()
    }
  }
})
</script>
