import request from '@zh/request'
import { apiPrefix } from '@/config'

export interface IMenuItem {
  appId: string;
  icon: string;
  id: string;
  label: string;
  /** 菜单名称 */
  name: string;
  path: string;
  parentId: string;
  children?: IMenuItem[];
}

export function getMenu () {
  return request<IMenuItem[]>({
    baseURL: apiPrefix.ams,
    url: '/menu/routes',
    reportError: false
  })
}

export function getButtons<T> () {
  return request<T>({
    baseURL: apiPrefix.ams,
    url: '/menu/buttons'
  })
}
