import request from '@zh/request'
import type { IUserInfo } from '@/store/userInfo'
import { apiPrefix } from '@/config'

export interface userInfo extends Record<string, any> {
  name: string;
  tenantId: string;
  tenantNameAbbreviation: string;
  isCurrentAccount?: number;
}

export async function getUserList (account: string) {
  return request({
    baseURL: apiPrefix.ams,
    url: `/oAUserInfo/list?account=${account}`
  }).then((res) => res.data as userInfo[])
}

export async function changeUser (data: { tenantId: string, changeAccount: string, fp: string }): Promise<IUserInfo> {
  return request({
    url: '/oauth/token',
    baseURL: apiPrefix.amsAuth,
    method: 'post',
    headers: {
      'Tenant-Id': data.tenantId
    },
    data: {
      changeAccount: data.changeAccount,
      fp: data.fp
    }
  }) as any
}
