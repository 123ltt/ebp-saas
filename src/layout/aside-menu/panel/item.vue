<template>
  <div :class="[`item-menu-level${level}`, { shadow: Array.isArray(itemMenu.children) && level > 0 }]">
    <template v-if="Array.isArray(itemMenu.children)">
      <div :class="`title-level${level}`">
        {{ itemMenu.name }}
      </div>
      <div :class="`content-level${level}`">
        <Item v-for="item in itemMenu.children"
              :key="item.id"
              :item-menu="item"
              :level="level + 1"
        />
      </div>
    </template>
    <el-link v-else
             type="primary"
             :class="[`link-level${level}`, 'popover-menu-link']"
             :data-path="itemMenu.path"
             :disabled="itemMenu.path === route.path"
             @click="toPage($event, itemMenu)"
    >
      {{ itemMenu.name }}
    </el-link>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { PropType } from 'vue'
import type { IMenuItem } from '../api'
import * as routers from '@/use/use-router'

defineProps({
  itemMenu: {
    type: Object as PropType<IMenuItem>,
    required: true
  },
  level: {
    type: Number,
    required: true
  }
})

const route = useRoute()
const toPage = (e: MouseEvent, data: IMenuItem) => {
  let { parentElement } = e.target as Element
  while (parentElement) {
    if (parentElement.getAttribute('role') === 'tooltip') {
      parentElement.style.display = 'none'
      break
    } else {
      parentElement = parentElement.parentElement
    }
  }
  routers.push(data.path, { title: data.name })
}
</script>

<style lang="scss" scoped>
  .title-level0 {
    height: 30px;
    margin-bottom: 5px;
    line-height: 30px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
  }
  .link-level0 {
    margin: 10px 0;
    font-weight: bold;
  }
  .content-level0 {
    max-width: 800px;
    display: flex;
    flex-wrap: wrap;
  }
  .title-level1 {
    margin-top: 2px;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
  }
.item-menu-level1,
.item-menu-level2 {
  font-weight: bold;
}
.item-menu-level1 {
  padding: 5px 10px 10px 10px;
}
.item-menu-level2 {
  margin: 5px 0 5px 10px;
}
.shadow {
  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
}

.popover-menu-link.el-link.el-link--primary {
  &:not(.is-disabled) {
    &:hover {
      color: var(--el-color-primary);
      text-decoration: underline;
    }
  }
  &.is-disabled {
    color: var(--el-text-color-regular);
  }
}
</style>
