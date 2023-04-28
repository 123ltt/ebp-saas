/**
 * 登录token信息、用户信息
 */
import { defineStore } from 'pinia'
import { useStorage, StorageSerializers } from '@vueuse/core'
import { RefreshTokenKey, TokenKey } from '@zh/request'
import { SITE_NAME } from '@/config'
import { createWatermark } from '@zh/utils'

export interface IUserInfo extends Record<string, string | number | undefined | null> {
  'access_token': string;
  'refresh_token': string;
  account: string;
  'real_name': string;
  'user_name': string;
  'nick_name': string;
  'expires_in': number;
  'role_id': string;
  'role_name': string;
  'user_id': string;
  'tenant_id'?: string;
  'tenant_name'?: string;
  /** 对接口返回的数据进行md5加密，并将md5值存放在该字段 */
  hash?: string | null;
}

export const useStoreUserInfo = defineStore('userInfo', {
  state: () => ({
    userInfo: useStorage<IUserInfo | null>('zh-user-info', null, localStorage, { serializer: StorageSerializers.object }),
    accessToken: useStorage<string>(TokenKey, ''),
    refreshAccessToken: useStorage<string>(RefreshTokenKey, '')
  }),
  getters: {
    /** 站点名称 */
    siteName: (state) => {
      return state.userInfo ? (state.userInfo.tenant_name || SITE_NAME) : SITE_NAME
    },
    /** 水印 */
    watermark: (state) => {
      if (!state.userInfo) return ''
      const { real_name: realName, nick_name: nickName, account } = state.userInfo
      return createWatermark(`${realName || nickName}(${account})`)
    }
  },
  actions: {
    updateUserInfo (value: IUserInfo) {
      this.userInfo = value
    },
    updateAccessToken (value: string) {
      this.accessToken = value
      this.userInfo!.access_token = value
    },
    updateRefreshAccessToken (value: string) {
      this.refreshAccessToken = value
      this.userInfo!.refresh_token = value
    },
    clearUserInfo () {
      this.userInfo = null
      this.accessToken = ''
      this.refreshAccessToken = ''
    }
  }
})
