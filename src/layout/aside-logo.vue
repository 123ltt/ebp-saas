<template>
  <div class="d-flex align-items-center justify-content-center flex-shrink-0 logo-box">
    <span class="fs-5 fw-bold">
      <component :is="logo" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { Home as IconHome } from '@icon-park/vue-next'
import { useStoreAside } from '@/store/aside'
import { useStoreUserInfo } from '@/store/userInfo'
import themes from '@/themes'

const userInfo = useStoreUserInfo()
const storeAside = useStoreAside()

const logo = computed(() => {
  const siteName = userInfo.siteName
  // 菜单折叠
  if (storeAside.collapse && themes.menuMode.value === 'vertical') {
    return h(IconHome, { size: '24px', title: siteName })
  }
  return h('span', { key: 'b' }, siteName.replace(/有限公司$/, ''))
})
</script>

<style lang="scss">
.logo-box {
  height: var(--el-menu-height);
  background-color: var(--logo-bg-color);
  color: var(--logo-text-color);
}
</style>
