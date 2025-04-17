/**
 * @description: 动态导入components
 * @author sundan
 */

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { unplugin } from 'vite-plugin-unplugin'

export const createUnPlugin = (env: Record<string, string>) => {
  return unplugin({
    env,
    imports: [
      'vue',
      'pinia',
      'vue-i18n',
      'vue-router',
      '@vueuse/core',
      {
        axios: [['default', 'axios']],
      },
    ],
    resolvers: [
      ElementPlusResolver({
        importStyle: false, // 必须设置false，否则会严重影响开发体验
      }),
    ],
    dirs: [
      // 将公用组件放到library/components文件夹下即可实现自动导入
      // 一定要注意导入的越多网页加载也慢，如无必要请勿修改此配置
    ],
  })
}
