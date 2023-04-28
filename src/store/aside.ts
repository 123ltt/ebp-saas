import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { IMenuItem } from '@/layout/aside-menu/api'

export const useStoreAside = defineStore('aside', {
  state: () => ({
    collapse: useStorage('collapse', false),
    menus: ref<IMenuItem[]>([])
  }),
  actions: {
    toggle () {
      this.collapse = !this.collapse
    },
    /** 设置菜单数据 */
    setMenu (data: IMenuItem[]) {
      this.menus = data
    }
  }
})
