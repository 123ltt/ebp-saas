import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineConfig } from '@/components/home-module/index'
import { useStoreUserInfo } from '@/store/userInfo'

export default defineConfig([
  {
    title: 'home.welcome.title',
    component: defineComponent({
      render () {
        const storeUserInfo = useStoreUserInfo()
        const { t } = useI18n()
        return h('h2', t('home.welcome.welcomeTo', { siteName: storeUserInfo.siteName }))
      }
    }),
    immediate: false
  }
])
