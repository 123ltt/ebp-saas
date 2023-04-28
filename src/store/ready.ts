import { defineStore } from 'pinia'

/**
 * 是否已经确定用户已登录
 * 确定了则显示页面
 */
export const useStoreReady = defineStore('ready', {
  state: () => ({
    ready: false
  }),
  actions: {
    updateReady (status: boolean) {
      this.ready = status
    }
  }
})
