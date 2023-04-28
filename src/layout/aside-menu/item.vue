<template>
  <el-sub-menu v-if="Array.isArray(data.children)"
               :index="data.path"
               :class="{'is-active': isHorizontal&&route.path.startsWith(data.path)}"
  >
    <template #title>
      <div class="d-flex align-items-center"
           style="line-height: 1;"
      >
        <el-icon v-if="data.parentId==='0'&&mode==='vertical'"
                 :size="18"
                 class="me-1 side-menu-icon"
        >
          <component :is="getIcon(data.label as any)" />
        </el-icon>
        <span>{{ getName(data.name) }}</span>
      </div>
    </template>
    <template v-if="storeAside.collapse || isHorizontal">
      <MenuPanel :menus="data.children"
                 :parent-name="data.name"
      />
    </template>
    <template v-else>
      <Item v-for="el in data.children"
            :key="el.id"
            :data="el"
            :mode="mode"
            :click-fn="clickFn"
      />
    </template>
  </el-sub-menu>
  <el-menu-item v-else
                :index="data.path"
                @click="clickFn(data)"
  >
    {{ data.name }}
  </el-menu-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { useRoute } from 'vue-router'
import { useStoreAside } from '@/store/aside'
import type { IMenuItem } from './api'
import getIcon from './icons'
import themes from '@/themes'
import type { TMenuMode } from '@/themes'
import MenuPanel from './panel/index.vue'

defineProps({
  data: {
    type: [Array, Object] as PropType<IMenuItem>,
    required: true
  },
  mode: {
    type: String as PropType<TMenuMode>,
    required: true
  },
  clickFn: {
    type: Function as PropType<(data: IMenuItem) => void>,
    required: true
  }
})

const route = useRoute()
const storeAside = useStoreAside()
const isHorizontal = computed(() => themes.menuMode.value === 'horizontal')

const getName = (name: string) => {
  if (isHorizontal.value) {
    return name.replace(/(管理)?系统$/, '')
  }
  return storeAside.collapse ? name.slice(0, 2) : name
}
</script>

<style lang="scss">
.el-menu--collapse {
  .el-sub-menu__icon-arrow, .side-menu-icon {
    display: none;
  }
}
</style>
