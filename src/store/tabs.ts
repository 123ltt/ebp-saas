import { defineStore } from 'pinia'
import { useStorage, useTitle } from '@vueuse/core'

interface ITab {
  label: string;
  /** 确保路径具有唯一性 */
  path: string;
  /** 标签是否可以关闭 */
  c?: boolean;
  /** 记录添加标签的时间，用于添加标签超过最大限制时，根据时间来移除最早的标签 */
  t?: number;
}

export const getHomeTab = () => ({ label: 'tabs.home', path: '/', c: false })

/**
 * 如果 tabs 超过最大长度，则根据时间移除最早使用的 tab
 */
function teardownTabs (tabs: ITab[]) {
  const maxTabLen = 20
  if (tabs.length >= maxTabLen) {
    let min = Infinity
    let minIndex = -1
    tabs.forEach((el, i) => {
      if (el.path !== '/') {
        const t = el.t || 0
        if (t < min) {
          min = t
          minIndex = i
        }
      }
    })

    if (minIndex > -1) {
      tabs.splice(minIndex, 1)
    }
    teardownTabs(tabs)
  }
}

export const useStoreTabs = defineStore('tabs', {
  state: () => {
    const homeTab = getHomeTab()
    return {
      currentTab: useStorage<ITab>('tab-current', homeTab, sessionStorage),
      tabs: useStorage<ITab[]>('tab-list', [homeTab], sessionStorage),
      title: useTitle()
    }
  },
  actions: {
    /**
     * 新增 Tab
     * @param tab 新增的 tab
     * @param afterCurrent 是否将新增的 tab 放到当前标签的后面
    */
    addTab (tab: ITab, afterCurrent = false) {
      const index = this.tabs.findIndex((el) => el.path === tab.path)
      const tabData = { ...tab, t: Date.now() }
      if (index > -1) {
        this.currentTab = this.tabs[index]
      } else {
        const currentIndex = this.tabs.findIndex((el) => el.path === this.currentTab.path)

        teardownTabs(this.tabs)

        if (afterCurrent && currentIndex > -1) {
          this.tabs.splice(currentIndex + 1, 0, tabData)
        } else {
          this.tabs.push(tabData)
        }
        this.currentTab = tabData
      }
    },
    /** 更新标签 */
    updateTab (path: string, newTab: Partial<ITab>) {
      const index = this.tabs.findIndex((el) => el.path === path)
      this.tabs.splice(index, 1, Object.assign(this.tabs[index], newTab))
    },
    /** 激活标签 */
    activeTab (path: string) {
      const d = this.tabs.find((el) => el.path === path)
      if (d) {
        d.t = Date.now()
        this.currentTab = d
      }
    },
    /** 移除标签 */
    removeTab (path: string) {
      const index = this.tabs.findIndex((el) => el.path === path)

      if (index > -1) {
        this.tabs.splice(index, 1)
        // 移除 tab 后，重置当前选中的 tab
        if (path === this.currentTab.path) {
          this.currentTab = this.tabs.length > 0 ? (this.tabs?.[index] || this.tabs[this.tabs.length - 1]) : getHomeTab()
        }
      }
    },
    /** 根据tab的索引进行删除 */
    removeTabByIndex (indexes: number | number[]) {
      const arr = Array.isArray(indexes) ? indexes : [indexes]
      const currentIndex = this.tabs.indexOf(this.currentTab)
      if (arr.includes(currentIndex)) {
        this.currentTab = getHomeTab()
      }
      const list = this.tabs.filter((el, index) => index === 0 || !arr.includes(index))
      this.tabs.splice(0, this.tabs.length, ...list) // 直接赋值不能触发视图的更新
    },
    /**
     * 检查路由地址是否存在对应的 tab
     * @param path 路由地址，默认当前页面的路由
     */
    existTab (path = window.location.pathname) {
      return this.tabs.some((el) => el.path === path)
    },
    clearCache () {
      const homeTab = getHomeTab()
      this.currentTab = homeTab
      this.tabs = [homeTab]
      this.title = null
    }
  }
})
