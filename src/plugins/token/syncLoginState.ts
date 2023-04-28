/**
 * 同步登录状态
 * 处理场景：
 *   1. 登录后打开多个页面，在其中一个页面退出登录，则在其他页面中提示已退出登录。
 *   2. 打开未登录页面，在其中一个进行登录也是一样的处理逻辑
 */
import { watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useStoreUserInfo } from '@/store/userInfo'
import type { IUserInfo } from '@/store/userInfo'
import { tokenTimeRef } from './autoRefreshToken'
import { i18nGlobal } from '@/modules/i18n'

let pending = false // 是否已弹窗显示退出登录
let isCurrentBrowserTab = false // 是否是当前浏览器页签 进行的退出登录
let cachePrevUserInfo: IUserInfo | null = null // 缓存上一次的用户数据

export function setCurrentBrowserTab () {
  isCurrentBrowserTab = true
}

type SyncStateType = 'INIT' | 'LOGOUT' | 'RELOGIN' | 'CHANGE_ACCOUNT';

/**
 * @param type INIT 第一次初始数据， LOGOUT 退出登录， CHANGE_ACCOUNT 切换账号, RELOGIN 重新登录
 */
function syncState (type: SyncStateType) {
  const t = i18nGlobal.t
  const mapping = {
    INIT: '',
    LOGOUT: t('syncLogin.loggedOut'),
    RELOGIN: '',
    CHANGE_ACCOUNT: t('syncLogin.changedAccount')
  }

  if (mapping[type]) {
    if (type === 'LOGOUT') {
      tokenTimeRef.value = null
      useStoreUserInfo().clearUserInfo()
    }

    // 如果已弹窗则将前面的弹窗关闭
    if (pending) ElMessageBox.close()

    pending = true
    ElMessageBox.alert(mapping[type], {
      type: 'info',
      title: t('syncLogin.loginTip'),
      showClose: false
    }).then((action: string) => {
      if (action === 'confirm') {
        window.location.reload() // 如果不是刷新页面则需要去重置pending值
      }
    })
  } else {
    ElMessageBox.close()
  }
}

/** 获取退出登录的弹窗状态 */
export function getPending () {
  return pending
}

/**
 * 监听 userInfo 数据的变化来触发多浏览器页签间的同步登录状态
 *
 * 需要在获取到 语言文件 后再调用该方法，否则会提示找不到对应语言的字段
 */
export function watchUserInfoToSyncState () {
  watch(() => useStoreUserInfo().userInfo, (newVal) => {
    let typeKey: SyncStateType = 'INIT'
    if (!cachePrevUserInfo) {
      cachePrevUserInfo = newVal
    } else if (!newVal) {
      typeKey = 'LOGOUT'
    } else if (newVal.account === cachePrevUserInfo.account) {
      typeKey = 'RELOGIN'
    } else {
      typeKey = 'CHANGE_ACCOUNT'
    }

    if (!isCurrentBrowserTab) syncState(typeKey)
  }, { immediate: true })
}
