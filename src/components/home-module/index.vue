<template>
  <el-card v-loading="loading"
           class="box-card border home-module"
  >
    <template #header>
      <div class="d-flex align-items-center justify-content-between">
        <el-button v-if="link"
                   size="small"
                   type="text"
                   class="fw-bold"
                   @click="$router.push(link as string)"
        >
          {{ t(title) }}
        </el-button>
        <b v-else>{{ t(title) }}</b>
        <el-button-group class="custom">
          <el-button v-for="btn in buttons"
                     :key="btn.label"
                     size="small"
                     :type="btn.value===currentBtnValue?'primary':''"
                     @click="onTabClick(btn)"
          >
            {{ t(btn.label) }}
          </el-button>
        </el-button-group>
      </div>
    </template>
    <component :is="component"
               ref="cmp"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { PropType, Component } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Button, Handler } from './index'

const { t } = useI18n()
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  /** 点击标题跳转的地址 */
  link: {
    type: String,
    default: ''
  },
  buttons: {
    type: Array as PropType<Button[]>,
    default: () => []
  },
  /** 显示的组件 */
  component: {
    type: [Object, Function] as PropType<Component>,
    required: true
  },
  handler: {
    type: Function as PropType<Handler>,
    default: () => {}
  },
  /** 是否立即执行`handler` */
  immediate: {
    type: Boolean,
    default: true
  },
  /** 是否允许当前选中的按钮可以再次点击执行`handler` */
  duplicateClick: {
    type: Boolean,
    default: false
  }
})

const loading = ref(true)
const cmp = ref(null)
const currentBtnValue = ref<any>(null)

if (Array.isArray(props.buttons) && props.buttons.length > 0) {
  const d = props.buttons.find((item) => item.default)
  currentBtnValue.value = d ? d.value : props.buttons[0].value
}

const emitHandler = () => {
  loading.value = true
  if (props.handler && cmp.value) {
    props.handler(cmp.value, currentBtnValue.value).finally(() => {
      loading.value = false
    })
  }
}

const onTabClick = (data: Button) => {
  if (!props.duplicateClick && currentBtnValue.value === data.value) return
  currentBtnValue.value = data.value
  emitHandler()
}

// 替代 vue2 中的 @hook:mounted
watch(cmp, () => {
  if (props.immediate) {
    emitHandler()
  }
})

onMounted(() => {
  if (!props.immediate) {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.home-module :deep(.el-card__header) {
  padding: 3px 1rem !important;
  b {line-height: 28px;}
}
</style>
