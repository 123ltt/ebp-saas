<template>
  <el-button class="border-0 mx-0 el-button-transparent"
             size="small"
             :icon="isFullscreen ? IconOffScreenOne : IconFullScreenOne"
             @click="toggle"
  />
</template>

<script setup lang="ts">
import { FullScreenOne as IconFullScreenOne, OffScreenOne as IconOffScreenOne } from '@icon-park/vue-next'
import { useFullscreen } from '@vueuse/core'

const { toggle, isFullscreen } = useFullscreen()
</script>
