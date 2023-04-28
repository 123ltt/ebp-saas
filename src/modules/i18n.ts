/* eslint-disable import/no-duplicates,import/no-unresolved */
import type { Plugin } from 'vue'
import { createI18n } from 'vue-i18n'

/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from '@intlify/vite-plugin-vue-i18n/messages'

const i18n = createI18n<false>({
  legacy: false,
  locale: 'zh',
  messages
})

export default <Plugin> function install (app) {
  app.use(i18n)
}

/** 可以通过该变量在 非setup 中可能使用 `t` 等方法 */
export const i18nGlobal = i18n.global
