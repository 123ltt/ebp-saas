<template>
  <el-config-provider :locale="locale">
    <router-view />
    <slot />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { zhCn } from 'element-plus/es/locales'

export default defineComponent({
  setup () {
    return { locale: zhCn }
  }
})
</script>
