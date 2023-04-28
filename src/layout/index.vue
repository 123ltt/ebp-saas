<template>
  <el-container v-show="storeReady.ready"
                class="h-100"
  >
    <el-aside v-if="isVertical"
              v-show="!noLayout"
              :width="width"
              class="d-flex-column aside-wrap"
    >
      <AsideLogo class="px-1" />
      <el-scrollbar class="flex-grow-1"
                    style="background-color: var(--menu-bg-color);"
      >
        <AsideMenu :mode="menuMode" />
      </el-scrollbar>
    </el-aside>
    <el-header v-else
               v-show="!noLayout"
               height="50px"
               class="d-flex px-0 layout-horizontal"
    >
      <AsideLogo class="px-3" />
      <AsideMenu :mode="menuMode"
                 class="flex-grow-1"
      />
      <div class="horizontal-right">
        <TopHeader />
      </div>
    </el-header>

    <el-container>
      <el-header v-if="!noLayout&&isVertical"
                 height="50px"
                 class="px-1"
      >
        <TopHeader />
      </el-header>
      <el-header v-if="!noLayout"
                 height="34px"
                 class="px-0 border-top-1"
                 :class="{'mt-1':!isVertical}"
      >
        <Tabs />
      </el-header>
      <el-main style="padding: 7px 7px 0;"
               :class="{'p-0':noLayout}"
      >
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { ElLoading } from 'element-plus'
import AsideLogo from '@/layout/aside-logo.vue'
import AsideMenu from '@/layout/aside-menu/index.vue'
import TopHeader from '@/layout/header.vue'
import Tabs from '@/layout/tabs/index.vue'
import { useStoreAside } from '@/store/aside'
import { useStoreReady } from '@/store/ready'
import AutoRefreshToken from '@/plugins/token/autoRefreshToken'
import theme from '@/themes'
import { getMenu } from '@/layout/aside-menu/api'
import useClear from '@/use/use-clear'

const $route = useRoute()
const storeAside = useStoreAside()
const storeReady = useStoreReady()
const width = computed(() => (storeAside.collapse ? 'auto' : '200px'))

const fullLoading = () => {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  watch(() => storeReady.ready, (val) => {
    if (val === true) {
      loadingInstance.close()
    }
  })
}

// 如果 params 中包含 np 属性，则认为是 $newPage 创建的页面。注意路由中的 `:np*` 规则
const noLayout = !!$route.params?.np
const isVertical = computed(() => theme.menuMode.value === 'vertical')
const menuMode = theme.menuMode

onBeforeMount(() => {
  const art = new AutoRefreshToken()
  onBeforeUnmount(() => art.destroy())
})

getMenu().then((res) => {
  storeReady.updateReady(true)
  storeAside.setMenu(res.data)
}).catch(() => {
  useClear()
  window.location.replace('/login')
})

fullLoading()
</script>
