<template>
  <div v-if="visible"
       aria-hidden="false"
       class="el-dropdown__popper el-popper is-light p-0 tabs-context-menu"
       role="tooltip"
  >
    <ul class="el-dropdown-menu">
      <template v-for="item in types">
        <li v-if="!(index===0&&item.key==='current')"
            :key="item.key"
            class="el-dropdown-menu__item"
            context-menu
            aria-disabled="false"
            tabindex="-1"
            @click="onCloseTabs(item.key)"
        >
          {{ t(item.text) }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed, onBeforeUnmount } from 'vue'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import closeTabs, { types } from './closeTabs'
import type { TCloseType } from './closeTabs'
import { useStoreTabs } from '@/store/tabs'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  ev: {
    type: [Object, null] as PropType<MouseEvent | null>,
    required: true
  },
  /** 右键菜单时所在tab的索引 */
  index: {
    type: Number,
    default: -1
  }
})

const { t } = useI18n()
const emits = defineEmits(['update:modelValue'])
const storeTabs = useStoreTabs()

const x = ref('')
const y = ref('')

// tabs 标签数量少于2个，则显示右键菜单
const visible = computed(() => props.modelValue && storeTabs.tabs.length > 1)

const onCloseTabs = (type: TCloseType) => {
  closeTabs(type, props.index)
  emits('update:modelValue', false)
}

// 处理右键菜单的关闭
const clickHandler = (e: MouseEvent) => {
  if (e.target) {
    const t = e.target as any
    if (t.hasAttribute('context-menu') && t.classList.contains('el-dropdown-menu__item')) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
  }
  emits('update:modelValue', false)
  /* eslint-disable-next-line no-use-before-define */
  removeListen()
}
const removeListen = () => document.removeEventListener('click', clickHandler)
watch(() => props.ev, (e) => {
  if (e) {
    x.value = `${e.clientX}px`
    y.value = `${e.clientY}px`
    document.addEventListener('click', clickHandler)
  }
})
onBeforeUnmount(() => removeListen())
</script>

<style scoped lang="scss">
.tabs-context-menu {
  position: absolute;
  inset: 0px auto auto 0px; // 写法相当于 top:0px; right:auto; bottom:auto; left:0px;
  transform: translate(v-bind('x'), v-bind('y'));
}
</style>

<i18n lang="yaml">
zh:
  current: '关闭'
  all: '关闭所有标签'
  others: '关闭其他标签'
  left: '关闭左侧标签'
  right: '关闭右侧标签'
en:
  current: 'Close current'
  all: 'Close all'
  others: 'Close others'
  left: 'Close tabs to the left'
  right: 'Close tabs to the right'
</i18n>
