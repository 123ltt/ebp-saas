import { throttle } from 'throttle-debounce'
import { useStorage } from '@vueuse/core'
import { tokenRefreshRate } from '@/config/index'
import { useStoreUserInfo } from '@/store/userInfo'
import { getPending } from './syncLoginState'
import doLogout from '@/layout/header/logout/logout'
import { refreshToken } from '@/pages/login/api'

export const tokenNameKey = 'tokenTime'

export const tokenTimeRef = useStorage(tokenNameKey, '')

/** 获取token的过期时间 */
export function getTokenExpired () {
  return (useStoreUserInfo().userInfo?.expires_in || 3600) * 1000 // 默认设置过期时间1小时
}

/**
 * 获取 token 最后一次更新的时间
 * @returns 毫秒数
 */
export function getLocalTokenTime () {
  const tokenTime = parseInt(tokenTimeRef.value || '', 36)
  if (Number.isNaN(tokenTime)) return 0
  return tokenTime
}

/**
 * 检测缓存中的 token 是否过期。true为过期
 */
export function isExpired () {
  return Date.now() - getLocalTokenTime() > getTokenExpired()
}

/**
 * 设置刷新token的时间
 * @param [newTokenTime] 毫秒数。默认值为`Date.now()`
 */
export function setRefreshTokenTime (newTokenTime = Date.now()) {
  if (!(typeof newTokenTime === 'number' && !Number.isNaN(newTokenTime))) throw new Error('参数必须为数值')
  tokenTimeRef.value = newTokenTime.toString(36)
}

/** 退出登录 */
function logout () {
  tokenTimeRef.value = null
  // 如果页面已有提示登录状态，则不处理
  if (getPending()) return

  doLogout()
}

/**
 * 需求是 用户不做任何操作则不去更新token
 * 通过监听事件 去触发更新token
 */
export default class AutoRefreshToken {
  /** 监听的事件 */
  events = ['mousemove', 'keydown']

  /** 满足条件回调 */
  callback = null

  refreshing = false

  /** 遮罩层dom */
  maskEl: HTMLElement | null = null

  /** 最后一次操作页面的时间 */
  useTime = 0

  userInfo

  constructor () {
    tokenTimeRef.value = Date.now().toString(36)
    this.events.forEach((type) => {
      window.addEventListener(type, this.listenHandler)
    })
    this.userInfo = useStoreUserInfo()
  }

  /** 检测token是否过期 */
  check () {
    if (this.refreshing) return

    const tokenTime = getLocalTokenTime()
    const expired = getTokenExpired()
    // 服务端token有效时长为1小时，所以如果: 1h - 用户取得token时长 <= tokenRefreshRate 则刷新token
    const t = expired - (Date.now() - tokenTime)

    if (this.useTime === 0) {
      this.useTime = Date.now()
      if (t < 0) {
        // 已过期（此时不要去刷新token，后端可能会生成新的token）
        logout()
      }
    } else if (Date.now() - this.useTime > expired) { // 距离上次操作超过过期时长
      if (t < 0) {
        // 且token过期，则直接退出登录
        logout()
      } else {
        // token未过期（可能其他页面更新了token，但当前页面长时间未操作）
        this.useTime = Date.now()
      }
    } else if (t < 0 && Date.now() - this.useTime < expired) { // token已过期，但距离上一次操作没有超过过期时长
      // 且 refreshAccessToken 不为空，则去刷新token
      if (this.userInfo.refreshAccessToken) {
        this.useTime = Date.now()
        this.mask() // 显示遮罩层，避免用户操作发起请求导致被T下线
        this.refresh()
      }
    } else if (t <= tokenRefreshRate * 1000) {
      // 临近过期
      this.refresh()
    }
  }

  /** 刷新token */
  refresh () {
    this.refreshing = true
    const newTokenTime = Date.now() // 提前设置时间，避免请求占用时间(宁愿提前也不能延后)

    refreshToken(this.userInfo.refreshAccessToken as string, this.userInfo.userInfo!.tenant_id)
      .then((res) => {
        this.userInfo.updateAccessToken(res.access_token)
        this.userInfo.updateRefreshAccessToken(res.refresh_token)
        // 更新获取token的时间
        setRefreshTokenTime(newTokenTime)
      })
      .finally(() => {
        this.refreshing = false
        if (this.maskEl) {
          document.body.removeChild(this.maskEl)
          this.maskEl = null
        }
      })
  }

  /** 显示遮罩层，避免token未更新成功而去请求其他接口导致被下线 */
  mask () {
    if (this.maskEl) return
    const div = document.createElement('div')
    const i = document.createElement('i')
    div.className = 'position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center'
    div.style.zIndex = '99'
    div.style.backgroundColor = '#ffffff30'
    i.className = 'el-icon-loading'
    div.appendChild(i)
    this.maskEl = div
    document.body.appendChild(div)
  }

  listenHandler = throttle(10000, () => {
    this.check()
  })

  destroy () {
    this.events.forEach((type) => {
      window.removeEventListener(type, this.listenHandler)
    })
  }
}
