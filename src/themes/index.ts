import { ref, readonly } from 'vue'
import { useStorage } from '@vueuse/core'

import defaultColor from './theme-default'
import darkenGreen from './theme-darken-green'
import themeDarkenBlack from './theme-darken-black'
import themeLightenGray from './theme-lighten-gray'
import themeDarkenBlue from './theme-darken-blue'
import themeLightenPurple from './theme-lighten-purple'

/** 所有主题 */
export const themes = {
  default: defaultColor,
  darkenGreen,
  themeDarkenBlack,
  themeLightenGray,
  themeDarkenBlue,
  themeLightenPurple
}

const themeKey = 'theme-color' // 存储 storage 的 key
type ThemeName = keyof typeof themes;
const themeName = useStorage<ThemeName>(themeKey, 'default')

export type TMenuMode = 'vertical' | 'horizontal';
// 菜单现实的模式
const menuMode = useStorage<TMenuMode>('menu-mode', 'vertical')

if (typeof themes[themeName.value] !== 'function') {
  themeName.value = 'default'
}

const colors = ref(themes[themeName.value]())

/** 设置 css 变量 */
function setCssVariables () {
  const id = 'customCssVars'
  const arr = Object.entries(colors.value).map(([key, value]) => (/^--/.test(key) ? `${key}:${value};` : ''))
  const style = document.getElementById(id) || document.createElement('style')
  style.id = id

  // :root 前面添加 html 提升优先级
  let styleStr = `html:root { ${arr.join('')} }`

  // 处理按钮样式
  const primaryBtn = {
    '--el-button-bg-color': '--el-color-primary',
    '--el-button-border-color': '--el-color-primary',
    '--el-button-hover-bg-color': '--el-color-primary-light-2',
    '--el-button-hover-border-color': '--el-color-primary-light-2',
    '--el-button-active-bg-color': '--el-color-primary',
    '--el-button-active-border-color': '--el-color-primary'
  }

  const btnVars = Object.entries(primaryBtn).map(([key, val]) => `${key}:var(${val}) !important;`)
  styleStr += `
.el-button--primary { ${btnVars.join(';')} }
.el-button.el-button--primary.is-plain{background-color:var(--el-color-primary-light-9);border-color:var(--el-color-primary-light-7);}
.el-button.el-button--primary.is-plain:hover,.el-button.el-button--primary.is-plain:focus{background-color:var(--el-color-primary);border-color:var(--el-color-primary);}
`

  style.innerHTML = styleStr
  document.head.appendChild(style)
}

/** 设置主题 */
function setTheme (name: ThemeName) {
  themeName.value = name
  colors.value = themes[name]()
  setCssVariables()
}

/** 设置布局 */
function setMenuMode (mode: TMenuMode) {
  menuMode.value = mode
}

setCssVariables()

export default {
  /**
   * 在模板中可以直接 `colors.xxx` 取值，而不需要 `colors.value.xxx`
   */
  color: readonly(colors),
  currentTheme: readonly(themeName),
  setTheme,
  menuMode: readonly(menuMode),
  setMenuMode,
  setCssVariables
}
