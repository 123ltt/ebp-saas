import defineColor from './define-color'

export default defineColor(() => ({
  themeName: '灰白',
  themeColor: '#ccc',

  '--logo-bg-color': '#dcdada',
  '--logo-text-color': '#333',

  '--menu-bg-color': '#efefef',
  '--menu-hover-bg-color': '#ccc',
  '--menu-text-color': '#333',
  '--menu-active-text-color': '#409EFF',
  '--menu-border-right-color': 'transparent',
  '--menu-sub-bg-color': '#ddd'
}))
