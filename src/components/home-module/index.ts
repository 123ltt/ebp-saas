import type { Component } from 'vue'

export type Button = {
  /** 按钮显示的文本 */
  label: string;
  /** 点击按钮将`value`传递给`handler` */
  value: any;
  /** 是否是默认选中的按钮，默认 `false` */
  default?: boolean;
}

/**
 * `componentRef` 传入组件 `component` 的 `ref`
 * `buttonValue` 被点击按钮的 `value`
 */
export type Handler = (componentRef: any, buttonValue: any) => Promise<any>;

export interface Configure {
  /** 显示的 标题 */
  title: string;
  /**
   * 该字段有两个作用
   * 1. 点击标题跳转的地址（即路由地址），
   * 2. 同时会通过 `link` 是否在菜单（对应 `path` 字段）中 判断是否显示该组件 */
  link?: string;
  /** 自定义显示在右上角的按钮 */
  buttons?: Button[];
  /** 是否允许当前选中的按钮（右上角的自定义按钮）可以再次点击执行`handler`。默认`false` */
  duplicateClick?: boolean;
  /** 点击按钮执行的函数，必须返回promise */
  handler?: Handler;
  /**
   * 组件（建议使用异步组件，特别是大组件，
   * 使用方法： `defineAsyncComponent(() => import('./xxx/xx.vue'))`
   * 建议使用 `shallowRef` 将异步组件包裹再赋值给 `component` 字段
   * `shallowRef(defineAsyncComponent(() => import('./xxx/xx.vue')))`
   * */
  component: Component;
  /** 是否立即执行`handler`。默认`true` */
  immediate?: boolean;
  /** 该组件占用的百分比（必须是百分比）。默认`100%` */
  width?: `${string}%`;
}

/**
 * 定义类型(便于代码提示，类似vue3的defineComponent)
 */
export function defineConfig (configures: Configure[]) {
  return configures
}

export { default as HomeModule } from './index.vue'
