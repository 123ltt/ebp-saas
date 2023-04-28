import request from '@zh/request'
import { apiPrefix } from '@/config'

type UpdatePasswdParams = {
  userId: string;
  oldPassword: string;
  newPassword: string;
  newPassword1: string;
}

export function updatePassword (params: UpdatePasswdParams) {
  return request({
    baseURL: apiPrefix.ams,
    url: '/user/update-password',
    method: 'post',
    params
  })
}
