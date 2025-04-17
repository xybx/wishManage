import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import chokidar from 'chokidar'
import dayjs from 'dayjs'
import pc from 'picocolors'
import type { Plugin } from 'vite'
import { createBanner } from './banner/'
import { createCompress } from './compress/'
import { createProgress } from './progress/'
import { createSvgIcons } from './svgSprite/'
import { createUnPlugin } from './unplugin/'
import { createVisualizer } from './visualizer/'
import { compress, localEnabled, port, prodEnabled, report } from '/@/config/'

const viteApp = 'VITE_' + 'APP_'
const viteUser = 'VITE_' + 'USER_'

export const createVitePlugin = (env: Record<string, string>) => {
  const vitePlugins: (Plugin | Plugin[])[] = [vue()]
  const userName = env[`${viteApp}GITHUB_USER_NAME`]
  const secretKey = env[`${viteApp}SECRET_KEY`]
  const nodeEnv = env[`${viteUser}NODE_ENV`]
  const isEmpty = (value: any) => {
    return value == undefined || value == '' || value == null
  }
  if (isEmpty(userName) || isEmpty(secretKey)) return
  if (nodeEnv !== 'development' && (isEmpty(userName) || isEmpty(secretKey))) return
  vitePlugins.push(
    vueJsx(),
    createProgress(env),
    createUnPlugin(env),
    createSvgIcons(),
    createBanner()
  )
  if (compress) vitePlugins.push(createCompress(compress))
  if (report) vitePlugins.push(createVisualizer())
  return vitePlugins
}

export const createWatch = (env: Record<string, string>) => {
  //为了防止新同事忘记配置授权码而造成项目无法打包，请保留以下提示
  const userName = env[`${viteApp}GITHUB_USER_NAME`]
  const secretKey = env[`${viteApp}SECRET_KEY`]
  const nodeEnv = env[`${viteUser}NODE_ENV`]

  if (nodeEnv === 'production' && (userName === 'test' || secretKey === 'preview')) {
    console.log(
      `${pc.red(
        '\u68C0\u6D4B\u5230\u60A8\u7684\u7528\u6237\u540D\u6216\u006B\u0065\u0079\u672A\u914D\u7F6E\uFF0C\u006B\u0065\u0079\u5728\u8D2D\u4E70\u65F6\u901A\u8FC7\u90AE\u4EF6\u9080\u8BF7\u51FD\u53D1\u653E\uFF0C\u5982\u60A8\u5DF2\u8D2D\u4E70\u8BF7\u4ED4\u7EC6\u9605\u8BFB\u6587\u6863\u5E76\u8FDB\u884C\u914D\u7F6E\uFF0C\u914D\u7F6E\u5B8C\u6210\u540E\u65B9\u53EF\u6253\u5305\u4F7F\u7528\u3002\u8D2D\u4E70\u5730\u5740\uFF1A\u0068\u0074\u0074\u0070\u0073\u003A\u002F\u002F\u0076\u0075\u0065\u002D\u0061\u0064\u006D\u0069\u006E\u002D\u0062\u0065\u0061\u0075\u0074\u0069\u0066\u0075\u006C\u002E\u0063\u006F\u006D\u002F\u0061\u0075\u0074\u0068\u006F\u0072\u0069\u007A\u0061\u0074\u0069\u006F\u006E\u002F\u0073\u0068\u006F\u0070\u002D\u0076\u0069\u0074\u0065\u002E\u0068\u0074\u006D\u006C'
      )}`
    )
    process.exit()
  }

  if (nodeEnv === 'development') {
    chokidar.watch('./src/views').on('change', (path) => {
      if (path.endsWith('vue')) {
        console.log(
          `\n${pc.gray(dayjs().format('HH:mm:ss'))} ${pc.cyan('[vite]')} ${pc.cyan(`http://localhost:${port}/`)} ${pc.green(
            'update success'
          )} `
        )
      }
    })
  }
}
