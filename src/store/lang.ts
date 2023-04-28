import { defineStore } from 'pinia'

export const locales = [
  { label: '中文', lang: 'zh' },
  { label: 'En', lang: 'en' }
] as const

export type TLang = typeof locales[number]['lang'];

export const useStoreLang = defineStore('lang', {
  state: () => ({
    lang: 'zh'
  }),
  getters: {
    label: (state) => {
      const d = locales.find(el => el.lang === state.lang)
      return d ? d.label : ''
    }
  },
  actions: {
    changeLang (lang: TLang) {
      this.lang = lang
    }
  }
})
