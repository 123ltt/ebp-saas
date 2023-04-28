import { Base64 } from 'js-base64'
import { throttle } from 'throttle-debounce'
import {
  clientId, clientSecret, headerAuth, TokenKey
} from './config'

/**
 * 空函数
 */
export function noop () { }

const storage = (() => {
  try {
    return localStorage
  } catch (err) {
    return { setItem: noop, getItem: noop }
  }
})()

export function generateUid () {
  const r = Number(String(Math.random()).slice(-6)).toString(32)
  const d = new Date()
  const arr = [d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()].map((el) => (`0${el}`).slice(-2))
  const s = [d.getFullYear(), ...arr, d.getMilliseconds()].join('')
  return `${s}_${r}`
}

/**
 * 返回权限验证需要的头部信息
 * @param isToken 是否需要token
 */
export function getAuthHeader (platform: 'service' | 'saas', isToken = true) {
  return {
    Authorization: `Basic ${Base64.encode(`${clientId}:${clientSecret(platform)}`)}`,
    [headerAuth]: `bearer ${isToken ? storage.getItem(TokenKey) : ''}`
  }
}

export type ErrorHandle = {
  /* eslint-disable-next-line no-unused-vars */
  (errMsg: string, logId?: string): void;
}
export const throttleFn = throttle(
  500,
  (fn: ErrorHandle | undefined, message: string, logId?: string) => {
    if (fn) fn(message, logId)
  }
)

// /**
//  * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
//  * 此代码压缩后会报错（找不到原因），只能使用 customError 函数替代
//  */
// export class CustomError extends Error {
//   data: any = null;

//   constructor(message?: string, data?: any) {
//     super(message); // 'Error' breaks prototype chain here
//     if (data !== undefined) {
//       this.data = data;
//       Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
//     }
//   }
// }

export function customError (message: string, data?: any) {
  const err: any = new Error(message)
  err.data = data
  return err as Error
}
