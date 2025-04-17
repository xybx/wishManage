import type { App } from 'vue'
import { errorLog } from '/@/config'
import pinia from '/@/store'
import { useErrorLogStore } from '/@/store/modules/errorLog'
import { isArray } from '/@/utils/validate'

export const needErrorLog = () => {
  const errorLogArray = isArray(errorLog) ? [...errorLog] : [errorLog]
  return errorLogArray.includes(import.meta.env.MODE)
}

export const addErrorLog = (err: any) => {
  if (!err.isRequest) console.error('错误拦截:', err)
  const url = window.location.href
  const { addErrorLog } = useErrorLogStore(pinia)
  addErrorLog({ err, url })
}

export default {
  install: (app: App<Element>) => {
    if (needErrorLog()) app.config.errorHandler = addErrorLog
  },
}
