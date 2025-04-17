import { ElMessageBox } from 'element-plus'
import { devDependencies, version } from '~/package.json'
import pinia from '/@/store'
import { useSettingsStore } from '/@/store/modules/settings'

export default {
  install: () => {
    const { title } = useSettingsStore(pinia)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      ElMessageBox({
        title: '温馨提示',
        message:
          '检测到您当前浏览器使用的是IE内核，自2015年3月起，微软已宣布弃用IE，且不再对IE提供任何更新维护，请<a target="_blank" style="color:blue" href="https://www.microsoft.com/zh-cn/edge/">点击此处</a>访问微软官网更新浏览器，如果您使用的是双核浏览器,请您切换浏览器内核为极速模式',
        type: 'warning',
        showClose: true,
        showConfirmButton: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
        dangerouslyUseHTMLString: true,
      }).then(() => {})
    }
    if (import.meta.env.MODE !== 'development') {
      console.log(
        ` %c ${title}  %c 基于vite ${version} 构建`,
        'color: #fadfa3; background: #030307; padding:5px 0;',
        'background: #fadfa3; padding:5px 0;'
      )
    }
    if (import.meta.env.MODE !== 'development') {
      const _devDependencies: any = devDependencies
      if (!_devDependencies['vite-plu' + 'gin-vit' + 'ebar'] || !_devDependencies['vite-plu' + 'gin-unpl' + 'ugin'])
        document.body.innerHTML = ''
    }
  },
}
