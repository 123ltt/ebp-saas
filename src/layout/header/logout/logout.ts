import request, { noop } from '@zh/request'
import useClear from '@/use/use-clear'
import { setCurrentBrowserTab } from '@/plugins/token/syncLoginState'
import { apiPrefix } from '@/config'

export default function doLogout (next = noop) {
  request({
    baseURL: apiPrefix.amsAuth,
    url: '/oauth/logout'
  }).finally(() => {
    setCurrentBrowserTab()
    useClear()
    next()

    // router.replace({ name: 'Login' }); // TODO 不要用路由跳转，目前没有对微应用销毁
    window.location.replace('/login')
  })
}
