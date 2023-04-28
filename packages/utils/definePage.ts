/**
 * 收集页面的所有模块及模块所用到的所有 api
 */

export type TModule = {
  /** 该模块在当前页面的唯一标识 */
  key: string;
  /** 模块名称 */
  name: string;
  /** 该模块使用的所有 api 集合 */
  apis: string[];
}

export type TPage = {
  /** 当前页面父级菜单 */
  parent?: string;
  /** 当前页面的 URL 路径 */
  path: string;
  /** 菜单名称 */
  name: string;
  /** 菜单是否启用。默认 `true` */
  status?: boolean;
  /** 该页面的所有模块 */
  modules: TModule[];
}

export default function definePage (pageData: TPage) {
  return pageData
}
