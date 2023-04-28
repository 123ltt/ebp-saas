import { createApp, h } from 'vue'
import { initRequest } from '@zh/request'
import { ElMessage } from 'element-plus'
import insertComponent from 'vue-insert-component'
import { createPinia } from 'pinia'
import router from './router'
import vueI18n, { i18nGlobal } from '@/modules/i18n'
import { watchUserInfoToSyncState } from '@/plugins/token/syncLoginState'
import App from './App.vue'
import DialogContainer from '@/components/dialog-container.vue'
import iconparkPlugin from './plugins/iconpark'
import autoSetTitle from './use/use-page'
import './styles/index'

initRequest({
  platform: 'saas',
  axiosOptions: {
    baseURL: '/api'
  },
  errorHandle (message, logId) {
    const vnode = h('div', [
      h('div', { class: 'fs-5 text-error' }, message),
      logId && h('div', { class: 'text-muted' }, i18nGlobal.t('ui.errorCode', { id: logId }))
    ])
    ElMessage.error(vnode)
  }
})

const app = createApp(insertComponent(App, DialogContainer))

app.config.globalProperties.$ELEMENT = {
  size: 'small'
}
app
  .use(createPinia())
  .use(vueI18n)
  .use(router)
  .use(iconparkPlugin)
  .mount('#app')
// 需要等语言文件加载完再去检测同步状态
watchUserInfoToSyncState()
autoSetTitle()
