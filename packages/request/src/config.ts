/** 客户端id */
export const clientId = 'saber'

const secretMap = {
  service: 'cams_saber_secret',
  saas: 'saber_secret'
}
/** 客户端密钥 */
export const clientSecret = (type: keyof typeof secretMap) => (secretMap[type])

/** Storage key */
export const TokenKey = 'zh-access-token'
/** Storage key */
export const RefreshTokenKey = 'zh-refresh-token'

export const headerAuth = 'Blade-Auth'

export const headerMenuId = 'Blade-Menu-id'

export const headerLogId = 'zhkj-req-id'

export const cacheDataKeyPrefix = 'req:'
