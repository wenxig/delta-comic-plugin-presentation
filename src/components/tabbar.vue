<script setup lang='ts'>
import { useResizeObserver } from '@vueuse/core'
import { Comp, PluginConfigSearchTabbar, Store } from 'delta-comic-core'
import { onMounted, ref, shallowRef } from 'vue'
import { ComponentExposed } from 'vue-component-type-helpers'
import { useRouter } from 'vue-router'
const $props = defineProps<{
  isActive: boolean
  tabbar: PluginConfigSearchTabbar
}>()
const $router = useRouter()

const list = shallowRef<ComponentExposed<typeof Comp.Waterfall>>()
const temp = Store.useTemp()
const orderScrollSaveTemp = temp.$applyRaw(`orderPScoreSave`, () => new Map<string, number>())
const containBound = ref<DOMRectReadOnly>()
useResizeObserver(() => <HTMLDivElement | null>list.value?.scrollParent?.firstElementChild, ([b]) => containBound.value = b.contentRect)
onMounted(async () => {
  list.value?.scrollParent?.scroll(0, orderScrollSaveTemp.get($props.tabbar.id) ?? 0)
})
const stop = $router.beforeEach(() => {
  stop()
  orderScrollSaveTemp.set($props.tabbar.id, list.value?.scrollTop ?? 0)
})

</script>

<template>
  
</template>