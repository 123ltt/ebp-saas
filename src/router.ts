import { createRouter, createWebHistory } from 'vue-router'
import { useStoreUserInfo } from '@/store/userInfo'
import Layout from '@/layout/index.vue'
import Home from '@/pages/home/index.vue'
import Login from '@/pages/login/index.vue'
import CatchPage from '@/pages/catchError.vue'
import { useStoreTabs } from './store/tabs'

import { routes as pmsRoutes } from '@zh/pms'

export const layoutRouteName = 'Layout'

/**
 * 判断路径是否是虚拟路由 （子应用通过 $newTab 方法创建）
 */
export function isVirtualRoute (path: string) {
  return /^\/[^/]+\/_nt/.test(path)
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: Login,
      meta: { auth: false }
    },
    {
      path: '/',
      name: layoutRouteName,
      component: Layout,
      children: [
        { path: '', name: 'Home', component: Home },
        ...pmsRoutes,
        { path: '/:p*', name: 'CatchError', component: CatchPage }
      ]
    },
    {
      path: '/updatePassword',
      name: 'UpdatePassword',
      meta: {
        auth: true
      },
      component: () => import('@/layout/header/update-password/index.vue')
    }
  ]
})

let firstLoad = true

router.beforeEach((to, from, next) => {
  // TODO 目前通过判断 accessToken 是否存在来确定用户是否登录
  const isLogin = !!useStoreUserInfo().accessToken

  // 首次进入页面，如果是虚拟路由路径则跳转到 首页
  if (firstLoad && isVirtualRoute(to.path)) {
    next('/')
  } else if (!isLogin && to.meta.auth !== false) {
    next({ name: 'Login' })
  } else if (isLogin && to.name === 'Login') {
    next('/')
  } else {
    if (to.meta.auth) {
      const name = (to.name || to.path) as string
      useStoreTabs().addTab({ label: name, path: to.path, c: true }, true)
    }

    next()
  }

  firstLoad = false
})

export default router
