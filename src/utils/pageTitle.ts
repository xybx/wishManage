import { titleReverse, titleSeparator } from '/@/config'
import { translate } from '/@/i18n'
import pinia from '/@/store'
import { useSettingsStore } from '/@/store/modules/settings'

/**
 * @description 设置标题
 * @param pageTitle
 * @returns {string}
 */
export default function getPageTitle(pageTitle: any) {
  const { getTitle } = useSettingsStore(pinia)
  let newTitles = []
  if (pageTitle) newTitles.push(translate(pageTitle))
  if (getTitle) newTitles.push(getTitle)
  if (titleReverse) newTitles = newTitles.reverse()
  return newTitles.join(titleSeparator)
}
