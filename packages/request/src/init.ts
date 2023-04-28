import Axios from 'axios'
import type { AxiosRequestConfig, Canceler } from 'axios'
import NProgress from 'nprogress'
import type { NProgressOptions } from 'nprogress'
import {
  generateUid, getAuthHeader, noop, customError,
  throttleFn
} from './util'
import type { ErrorHandle } from './util'
import { headerMenuId, headerLogId } from './config'

export interface RequestConfig extends AxiosRequestConfig {
  /** response拦截器中 获取到请求操作是否气泡提示错误。默认 `true` */
  reportError?: boolean;
  /** vue 组件实例 */
  componentInstance?: any;
  /** 是否使用 requestCache方法请求，默认 `false` */
  useCache?: boolean;
  /** 是否请求接口重新缓存数据，默认 `false` 。`useCache` 为 `true` 时才生效 */
  recache?: boolean;
}

export interface Options {
  /** 平台类型，默认 `service` */
  platform?: 'service' | 'saas';
  /** vue-router 实例 */
  router?: any;
  axiosOptions?: RequestConfig;
  nprogressOptions?: Partial<NProgressOptions>;
  errorHandle?: ErrorHandle;
}

/** 缓存所有请求的cancelHandler */
const cancelHandler: { uid: string; c: Canceler; handler: () => void }[] = []

function removeCancelHandlerItem (config: RequestConfig) {
  const index = cancelHandler.findIndex((el) => el.uid === config.headers[headerLogId])
  const item = cancelHandler.splice(index, 1)[0]
  // TODO 下面写法不适用 vue3
  if (config.componentInstance && config.componentInstance.$off) {
    config.componentInstance.$off('hook:beforeDestroy', item.handler)
  }
}

export default function init ({
  platform = 'service',
  router = null,
  axiosOptions = {},
  nprogressOptions = {},
  errorHandle = noop
}: Options = {}) {
  const options: AxiosRequestConfig = {
    baseURL: '/api',
    timeout: 30000,
    validateStatus (status) {
      return status >= 200 && status <= 500
    },
    ...axiosOptions
  }

  NProgress.configure({
    showSpinner: false,
    ...nprogressOptions
  })

  const instance = Axios.create(options)

  instance.interceptors.request.use<RequestConfig>((config) => {
    if (config.url === '') return config
    NProgress.start()

    const newConfig: RequestConfig = { reportError: true, ...config }
    let menuId = ''

    // 后端要求传menu-id
    if (router) {
      const routeMeta = router.app.$route.meta // TODO 需要针对 vue-router v3 和 v4 进行处理
      menuId = routeMeta.id || (routeMeta.data ? routeMeta.data.menuId : '')
    }

    const uid = generateUid()

    if (!newConfig.cancelToken) {
      newConfig.cancelToken = new Axios.CancelToken((c) => {
        const obj = {
          uid,
          c,
          handler () {
            removeCancelHandlerItem(newConfig)
            c()
          }
        }
        // TODO 下面写法不适用 vue3
        if (newConfig.componentInstance && newConfig.componentInstance.$once) {
          newConfig.componentInstance.$once('hook:beforeDestroy', obj.handler)
        }
        cancelHandler.push(obj) // 可根据链路id去移除元素
      })
    }

    Object.assign(config.headers, {
      ...getAuthHeader(platform),
      [headerMenuId]: menuId,
      [headerLogId]: uid
    })

    if (config.method?.toLowerCase() === 'get') {
      newConfig.params = { _: Date.now(), ...newConfig.params }
    }

    return newConfig
  }, (error) => Promise.reject(error))

  instance.interceptors.response.use(async (res) => {
    NProgress.done()

    const newConfig = res.config as RequestConfig

    let { data } = res
    // 如果是blob 且 类型为json，则转成 对象
    if (
      Object.prototype.toString.call(data) === '[object Blob]' &&
      data.type.indexOf('application/json') === 0
    ) {
      try {
        data = JSON.parse(await data.text())
      } catch (err) {
        //
      }
    }

    // 获取状态码
    const status = data.code || res.status
    const message = data.msg || data.message || data.error_description || '未知错误'
    // 如果是401则跳转到登录页面
    if (status === 401) {
      cancelHandler.forEach((el) => el.c())
      cancelHandler.length = 0
      if (router) {
        router.replace('/login').then(() => throttleFn(errorHandle, message))
      }
      const e = new Error(message)
      return Promise.reject(e)
    }

    // 非401状态则移除相应的元素，避免cancelHandler数组不断增长
    removeCancelHandlerItem(newConfig)

    // 如果请求为非200否者默认统一处理
    if (status !== 200) {
      if (newConfig.reportError) {
        throttleFn(errorHandle, message, newConfig.headers[headerLogId])
      }
      return Promise.reject(customError(message, data))
    }
    return Object.assign(res, { data })
  }, (error) => {
    if (error.code === 'ECONNABORTED' && error.config.reportError) {
      throttleFn(errorHandle, '接口请求超时', error.config.headers[headerLogId])
    }
    NProgress.done()
    const e = new Error(error)
    return Promise.reject(e)
  })

  return instance
}
