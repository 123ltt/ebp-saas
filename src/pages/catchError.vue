<template>
  <div>{{ t('404') }}</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<i18n lang="yaml">
zh:
  404: '404，页面不存在'
en:
  404: '404, Not found'
</i18n>
