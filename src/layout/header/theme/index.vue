<template>
  <el-popover placement="bottom"
              trigger="click"
              width="auto"
  >
    <template #reference>
      <el-button :icon="IconPlatte"
                 class="border-0 el-button-transparent"
                 size="small"
      />
    </template>
    <div class="d-flex align-items-stretch">
      <div class="border-end-1 me-4 pe-4">
        <div class="fs-5 mb-3 border-bottom-1">
          {{ t('layout') }}
        </div>
        <div class="d-flex justify-content-between">
          <template v-for="item in layouts"
                    :key="item.mode"
          >
            <component :is="item.icon"
                       size="40px"
                       :stroke-width="3"
                       class="mx-1 cursor-pointer"
                       :fill="theme.menuMode.value===item.mode?'var(--el-color-primary)':undefined"
                       @click="theme.setMenuMode(item.mode)"
            />
          </template>
        </div>
      </div>
      <div>
        <div class="fs-5 mb-3 border-bottom-1">
          {{ t('color') }}
        </div>
        <div class="d-flex flex-wrap color-box">
          <div v-for="item in list"
               :key="item.themeKey"
               class="color-block cursor-pointer d-flex align-items-center justify-content-center"
               :style="{background:item.themeColor}"
               @click="theme.setTheme(item.themeKey)"
          >
            <IconCheck v-if="item.themeKey===theme.currentTheme.value"
                       size="20px"
            />
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Platte as IconPlatte, Check as IconCheck, TopBar as IconTopBar, LeftBar as IconLeftBar } from '@icon-park/vue-next'
import theme, { themes } from '@/themes/index'
import type { TMenuMode } from '@/themes/index'

const { t } = useI18n()

const list = Object.keys(themes).map((k) => {
  const key = k as keyof typeof themes
  const item = themes[key]()
  return { themeKey: key, ...item }
})

const layouts: {icon: any; mode: TMenuMode}[] = [
  { icon: IconLeftBar, mode: 'vertical' },
  { icon: IconTopBar, mode: 'horizontal' }
]
</script>

<style scoped lang="scss">
$colorBlockSize: 30px;

.color-box {
  width: calc($colorBlockSize * 3)
}
.color-block {
  width: $colorBlockSize;
  height: $colorBlockSize;
  color: var(--menu-text-color);
}
</style>

<i18n lang="yaml">
zh:
  layout: '布局'
  color: '颜色'
en:
  layout: 'Layouts'
  color: 'Colors'
</i18n>
