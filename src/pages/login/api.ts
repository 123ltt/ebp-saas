import request from '@zh/request'
import { apiPrefix } from '@/config'
import type { IUserInfo } from '@/store/userInfo'

/**
 * 获取验证码
 */
export function getCaptcha (): Promise<{ image: string; key: string }> {
  return request({
    baseURL: apiPrefix.amsAuth,
    url: '/oauth/captcha'
  }) as any
}

type TData = {
  tenantId?: string;
  username: string;
  password: string;
  fp: string;
};
type THeaders = { code: string; key: string };

/**
 * 登录
 */
export function doLogin (data: TData, headers: THeaders): Promise<IUserInfo> {
  return request({
    baseURL: apiPrefix.amsAuth,
    url: '/oauth/token',
    method: 'post',
    headers: {
      'Captcha-Code': headers.code,
      'Captcha-Key': headers.key,
      'Tenant-Id': data.tenantId
    },
    data: {
      grant_type: 'captcha',
      scope: 'all',
      type: 'account',
      ...data
    }
  }) as any
}

/** 刷新 token */
export function refreshToken (token: string, tenantId?: string): Promise<IUserInfo> {
  return request({
    baseURL: apiPrefix.amsAuth,
    url: '/oauth/token',
    method: 'post',
    headers: {
      'Tenant-Id': tenantId
    },
    params: {
      tenantId,
      refresh_token: token,
      grant_type: 'refresh_token',
      scope: 'all'
    }
  }) as any
}
