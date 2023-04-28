import defineColor from './define-color'

export default defineColor(() => ({
  themeName: '暗黑',
  themeColor: '#333',

  '--logo-bg-color': '#1f1d1d',
  '--logo-text-color': '#fff',

  '--menu-bg-color': '#333',
  '--menu-hover-bg-color': '#555',
  '--menu-text-color': '#fff',
  '--menu-active-text-color': '#68825c',
  '--menu-border-right-color': 'transparent',
  '--menu-sub-bg-color': '#222'

  // '--el-color-primary': '#666666',
  // '--el-color-primary-light-1': '#464646',
  // '--el-color-primary-light-2': '#595959',
  // '--el-color-primary-light-3': '#6c6c6c',
  // '--el-color-primary-light-4': '#7f7f7f',
  // '--el-color-primary-light-5': '#929292',
  // '--el-color-primary-light-6': '#a5a5a5',
  // '--el-color-primary-light-7': '#b8b8b8',
  // '--el-color-primary-light-8': '#cbcbcb',
  // '--el-color-primary-light-9': '#dedede',
}))
