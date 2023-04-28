<template>
  <div class="d-flex flex-wrap">
    <div v-for="(item,index) in configures"
         :key="index"
         :style="{width:getWidth(item.width)}"
    >
      <HomeModule v-if="canShow(item.link)"
                  v-bind="item"
                  class="m-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { HomeModule } from '@/components/home-module/index'
import config from './config'
import commonConfigures from './common'
import type { Configure } from '@/components/home-module/index'
import { useStoreAside } from '@/store/aside'
import { eachMenu } from '@zh/utils'
import type { IMenuItem } from '@/layout/aside-menu/api'

const platformConfigures = ref<Configure[]>(config)
const storeAside = useStoreAside()
const canShow = (path?: string) => {
  if (!path) return true

  // 判断菜单中是否包含 `path`（即配置中的`link`）
  return eachMenu<IMenuItem>(storeAside.menus, (item) => {
    return item.path === path
  })
}

// 菜单和模块配置 都是通过异步获取的
const configures = computed(() => {
  if (platformConfigures.value && storeAside.menus.length > 0) {
    const list = platformConfigures.value.filter((item) => canShow())
    return list.length > 0 ? list : commonConfigures
  }
  return []
})

const getWidth = (val?: string) => (val && (/^(100|\d{1,2})%$/.test(val)) ? val : '100%')
</script>
