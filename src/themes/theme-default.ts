import defineColor from './define-color'

export default defineColor(() => ({
  themeName: '默认',
  themeColor: '#242a4b',

  '--logo-bg-color': '#181d39',
  '--logo-text-color': '#fff',

  '--menu-bg-color': '#242a4b',
  '--menu-hover-bg-color': '#5f6899',
  '--menu-text-color': '#fff',
  '--menu-active-text-color': '',
  '--menu-border-right-color': 'transparent',
  '--menu-sub-bg-color': '#151a35'
}))
