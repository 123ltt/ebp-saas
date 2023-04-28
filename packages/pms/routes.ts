import type { RouteRecordRaw } from 'vue-router'

export default <RouteRecordRaw[]>[
  {
    path: '/pms/spuSkuList',
    component: () => import('./views/spuSkuList/index.vue')
  },
  {
    path: '/pms/otherMappingTable',
    component: () => import('./views/spu/index.vue')
  }
]
