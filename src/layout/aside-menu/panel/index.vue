<template>
  <div class="menu-panel">
    <div class="title">
      {{ parentName }}
    </div>
    <div class="content">
      <ItemMenu v-for="item in menus"
                :key="item.id"
                :item-menu="item"
                :level="0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IMenuItem } from '../api'
import ItemMenu from './item.vue'

defineProps({
  menus: {
    type: Array as PropType<IMenuItem[]>,
    required: true
  },
  parentName: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.menu-panel {
  margin-top: -5px;
  .title {
    height: 30px;
    line-height: 30px;
    font-weight: bold;
    text-align: center;
    background-color: #eee;
  }
  .content {
    max-height: 95vh;
    padding: 0 10px;
  }
}
</style>
