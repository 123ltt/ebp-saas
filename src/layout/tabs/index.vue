<template>
  <teleport to="body">
    <ContextMenu v-model="contextmenuVisible"
                 :ev="ev"
                 :index="contextmenuOnTabIndex"
    />
  </teleport>
  <el-tabs v-model="activated"
           type="card"
           class="custom-tabs px-2"
           @tab-click="onActive"
           @tab-remove="onRemove"
           @contextmenu="onContextmenu"
  >
    <el-tab-pane v-for="el in storeTabs.tabs"
                 :key="el.path"
                 :label="tt(el.label)"
                 :name="el.path"
                 :closable="el.c !== false"
    />
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStoreTabs } from '@/store/tabs'
import ContextMenu from './contextmenu.vue'

const { t } = useI18n()

const storeTabs = useStoreTabs()
const activated = ref(storeTabs.currentTab?.path)
const onActive = (tab: any) => storeTabs.activeTab(tab.props.name)
const onRemove = (name: string | number) => storeTabs.removeTab(String(name))

const contextmenuVisible = ref(false)
const contextmenuOnTabIndex = ref(-1) // 记录右键菜单时所处的tab的索引
const ev = ref<MouseEvent | null>(null)

const onContextmenu = (e: MouseEvent) => {
  const target = e.target as any
  if (target.classList.contains('el-tabs__item')) {
    e.preventDefault()
    e.stopPropagation()
    contextmenuOnTabIndex.value = [...target.parentElement.children].indexOf(target)
    contextmenuVisible.value = true
    ev.value = e
  }
}

// 如果是 xxx.xxx 格式，则认为是使用多语言的标签
const tt = (val: string) => (/^(\w+\.)+\w+$/.test(val) ? t(val) : val)

watch(() => storeTabs.currentTab, (val) => {
  activated.value = val?.path
})
</script>

<style lang="scss" scoped>
.custom-tabs {
  box-shadow: 0 3px 2px 0 rgb(0 0 0 / 5%);
  :deep(.el-tabs__nav-next),
  :deep(.el-tabs__nav-prev) {
    line-height: var(--el-header-height);
  }

  :deep(.el-tabs__content) {
    display: none;
  }
}

.custom-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.custom-tabs :deep(.el-tabs__item) {
  font-size: var(--el-font-size-base);
  height: var(--el-header-height);
  line-height: var(--el-header-height);
  border: none !important;
  background-color: transparent;
  transition: background-color 0.5s;
  padding: 0 15px !important;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  background-color: var(--el-color-primary-light-9);
}

.custom-tabs > :deep(.el-tabs__header) {
  border-bottom: none;
}
.custom-tabs > :deep(.el-tabs__header .el-tabs__nav) {
  border: none;
}
</style>
