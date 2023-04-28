<template>
  <el-dropdown trigger="click"
               @command="onSelect"
  >
    <el-button size="small"
               class="border-0 el-button-transparent"
    >
      <el-icon>
        <IconTranslate />
      </el-icon>
      {{ storeLang.label }}
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in locales"
                          :key="item.lang"
                          :command="item"
                          :disabled="item.lang===storeLang.lang"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Translate as IconTranslate } from '@icon-park/vue-next'
import { useStoreLang, locales } from '@/store/lang'

const { locale } = useI18n()
const storeLang = useStoreLang()

const onSelect = async (data: typeof locales[number]) => {
  locale.value = data.lang
  storeLang.changeLang(data.lang)
}
</script>
