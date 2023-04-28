
type TRecursionMenuCb<T> = (val: T) => boolean

/**
 * 递归遍历菜单
 * @param data 菜单数据
 * @param cb 回调。返回 true 则会终止递归
 */
export default function eachMenu<T extends Record<string, any>> (data: T[], cb: TRecursionMenuCb<T>): boolean {
  return data.some((el) => (Array.isArray(el.children) ? eachMenu(el.children, cb) : cb(el)))
}
