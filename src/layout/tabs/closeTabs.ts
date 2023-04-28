import { useStoreTabs } from '@/store/tabs'

export const types = [
  { key: 'current', text: 'current' },
  { key: 'all', text: 'all' },
  { key: 'others', text: 'others' },
  { key: 'left', text: 'left' },
  { key: 'right', text: 'right' }
] as const

export type TCloseType = (typeof types[number])['key'];

export default function closeTabs (type: TCloseType, index: number) {
  const storeTabs = useStoreTabs()
  const allIndexes = [...new Array(storeTabs.tabs.length)].map((el, i) => i)
  let indexes: number[] | null = null
  switch (type) {
    case 'current':
      indexes = [index]
      break
    case 'all':
      indexes = allIndexes
      break
    case 'others':
      indexes = allIndexes.filter((el) => el !== index)
      break
    case 'left':
      indexes = allIndexes.slice(0, index)
      break
    case 'right':
      indexes = allIndexes.slice(index + 1)
      break
    default:
  }

  if (indexes && allIndexes.length > 1) storeTabs.removeTabByIndex(indexes)
}
