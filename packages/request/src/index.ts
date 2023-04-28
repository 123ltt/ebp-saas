import type { AxiosInstance } from 'axios'
import { Md5 } from 'ts-md5/dist/md5'
import init from './init'
import type { Options, RequestConfig } from './init'
import { cacheDataKeyPrefix } from './config'

export { default as axios } from 'axios'
export { getAuthHeader, noop } from './util'
export { TokenKey, RefreshTokenKey } from './config'

interface ResData<T = any> {
  code: 401 | 500 | 200 | number;
  success: boolean;
  msg: string;
  data: T;
}

let instance: AxiosInstance

/**
 * 初始化 request
 */
export function initRequest (options?: Options) {
  if (instance !== undefined) return
  instance = init(options)
}

export default async function request<T> (
  options: RequestConfig,
  componentInstance?: any
): Promise<ResData<T>> {
  if (instance) {
    Object.assign(options, { componentInstance })

    if (options.useCache) {
      /* eslint-disable-next-line no-use-before-define */
      return requestCache(options)
    }
    return instance(options).then((res) => res.data)
  }
  throw new Error('未初始化 request')
}

/**
 * 根据请求的 url、method、params、data 数据生成唯一key
 * 请求返回的数据缓存到本地，下次请求时直接读取缓存
 */
export async function requestCache<T> (options: RequestConfig): Promise<ResData<T>> {
  const {
    url, data = '', params = '', recache = false
  } = options
  const method = (options.method || 'get').toLowerCase()
  const uniqueKey = cacheDataKeyPrefix + Md5.hashStr([url, method, JSON.stringify(data), JSON.stringify(params)].join(''))
  if (!recache) {
    const result = sessionStorage.getItem(uniqueKey)
    if (result) {
      try {
        return Promise.resolve(JSON.parse(result))
      } catch (err) {
        //
      }
    }
  }

  return instance(options).then((res) => {
    sessionStorage.setItem(uniqueKey, JSON.stringify(res.data))
    return res.data
  })
}

/**
 * 清空通过 requestCache 方法请求产生的缓存数据
 * @param key 删除的key，key为空时则清空所有
 */
export function clearRequestCache (key?: string) {
  if (key) {
    sessionStorage.removeItem(key)
  } else {
    Object.keys(sessionStorage).forEach((k) => {
      if (k.indexOf(cacheDataKeyPrefix) === 0) {
        sessionStorage.removeItem(k)
      }
    })
  }
}
