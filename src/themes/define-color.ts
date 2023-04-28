export interface Colors extends Record<string, string> {
  /** 主题名称 */
  themeName: string;
  /** 主题显示颜色 */
  themeColor: string;

  /** Logo 背景色 */
  '--logo-bg-color': string;
  /** Logo 文字颜色 */
  '--logo-text-color': string;

  /** 菜单的背景色 */
  '--menu-bg-color': string;
  /** 鼠标经过菜单时背景色 */
  '--menu-hover-bg-color': string;
  /** 菜单的文字颜色 */
  '--menu-text-color': string;
  /** 当前激活菜单的文字颜色 */
  '--menu-active-text-color': string;
  /** 整体 右边框 */
  '--menu-border-right-color': string;
  /** 展开的菜单的背景色 */
  '--menu-sub-bg-color': string;
}

export type ColorKeys = keyof Colors;

export default function defineColor (colorFn: () => Colors) {
  return colorFn
}
