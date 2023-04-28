import { watch } from 'vue'
import { useTitle } from '@vueuse/core'
import { useStoreTabs, getHomeTab } from '@/store/tabs'
import { useStoreLang } from '@/store/lang'
import { i18nGlobal } from '@/modules/i18n'
import router from '@/router'

let used = false
/** 浏览器标题 */
const title = useTitle()

export default function autoSetTitle () {
  if (used) return // 防止多次调用
  used = true
  const storeTabs = useStoreTabs()
  const homeTab = getHomeTab()
  const getTitle = () => {
    const { path, label } = storeTabs.currentTab
    return path === homeTab.path ? i18nGlobal.t(label) : label
  }

  // 初始标题
  title.value = getTitle()

  // 切换 tab 更新标题 并 跳转
  watch(() => storeTabs.currentTab, (val) => {
    if (val) {
      title.value = getTitle()
      router.push(val.path)
    }
  })

  // 切换语言更新标题
  watch(() => useStoreLang().lang, () => {
    title.value = getTitle()
  })
}
