<template>
  <el-menu :default-active="route.path"
           :collapse="isCollapse"
           :mode="mode"
           height="50px"
           class="aside-el-menu"
           unique-opened
  >
    <MenuItem v-for="el in storeAside.menus"
              :key="el.id"
              :data="el"
              :click-fn="handleSelect"
              :mode="mode"
    />
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { useRoute } from 'vue-router'
import { useStoreAside } from '@/store/aside'
import * as routers from '@/use/use-router'
import MenuItem from '@/layout/aside-menu/item.vue'
import type { TMenuMode } from '@/themes/index'
import type { IMenuItem } from './api'

const props = defineProps({
  mode: {
    type: String as PropType<TMenuMode>,
    default: 'vertical'
  }
})

const storeAside = useStoreAside()
const route = useRoute()
const handleSelect = (data: IMenuItem) => {
  routers.push(data.path, { title: data.name })
}

const isCollapse = computed(() => {
  if (props.mode === 'horizontal') return false
  return storeAside.collapse
})
</script>

<style lang="scss">
// TODO 悬浮菜单需要考虑一下要不要做成旧版一样
.aside-el-menu .el-menu,
.aside-el-menu.el-menu {
  --el-menu-bg-color: var(--menu-bg-color);
  --el-menu-text-color: var(--menu-text-color);
  --el-menu-hover-text-color: var(--menu-text-color);
  --el-menu-hover-bg-color: var(--menu-hover-bg-color);
  --el-menu-active-color: var(--menu-text-color);
  border-right-color: var(--menu-border-right-color);
}

.aside-el-menu .el-sub-menu__title,
.el-menu--vertical .el-sub-menu__title {
  height: 44px;
  line-height: 44px;
}
.aside-el-menu .el-sub-menu .el-menu-item,
.el-menu--vertical .el-menu-item {
  height: 40px;
  line-height: 40px;
}

.aside-el-menu {
  .el-menu {
    background-color: var(--menu-sub-bg-color);
  }
  .el-sub-menu__title {
    background-color: transparent;
    &:hover {
      background-color: var(--menu-hover-bg-color);
    }
  }
  .el-menu-item.is-active {
    background-color: var(--menu-hover-bg-color);
  }

  &.el-menu--horizontal {
    border-bottom: none;

    > .el-sub-menu {
      .el-sub-menu__title:hover{
        background-color: var(--el-menu-hover-bg-color);
      }

      &.is-active {
        position: relative;

        &:after {
          content: '';
          margin-left: 25%; // 50% - (width / 2)
          width: 50%;
          height: 3px;
          border-radius: 2px;
          background-color: var(--menu-hover-bg-color);
          position: absolute;
          bottom: 4px;
        }

        .el-sub-menu__title {
          border: none;
        }
      }
    }
  }

  &.el-menu--horizontal>.el-sub-menu .el-sub-menu__title {
    height: var(--el-menu-height);
    line-height: var(--el-menu-height);
    padding: 0 15px;
  }
}
</style>
