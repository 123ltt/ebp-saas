<template>
  <el-dialog v-model="show"
             :title="options.title"
             :width="options.width"
             custom-class="custom-dialog"
             v-bind="dialogOptions"
             @closed="onClosed"
  >
    <slot />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, provide, computed } from 'vue'
import type { PropType } from 'vue'
import type { InsertOptions } from 'vue-insert-component'

const props = defineProps({
  options: {
    type: Object as PropType<InsertOptions>,
    default: () => ({
      title: '',
      width: '30%'
    })
  }
})

const emits = defineEmits(['close'])

const show = ref(true)
const dialogOptions = computed(() => {
  const defaults = {
    'destroy-on-close': true,
    'append-to-body': true,
    'close-on-click-modal': false
  }
  return Object.assign(defaults, props.options.dialogOptions)
})

provide('close', (...args: any[]) => {
  show.value = false
  if (props.options.callback) {
    props.options.callback(...args)
  }
})

const onClosed = () => emits('close')

</script>

<style lang="scss">
.custom-dialog {
  .el-dialog__body {
    padding: 12px;
  }
}
</style>
