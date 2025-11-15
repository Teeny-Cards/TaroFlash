<script setup lang="ts">
import UiTooltip from '@/components/ui-kit/tooltip.vue'
import { onMounted, ref, useTemplateRef } from 'vue'

const percent = defineModel<number>()

const container = useTemplateRef('container')
const fill = useTemplateRef('fill')

const is_dragging = ref(false)

let gap = 0
let thumb_offset = 0
let thumb: HTMLElement | null

onMounted(() => {
  if (!percent.value || !container.value) return

  thumb = container.value.querySelector('[data-testid="ui-kit-slider__thumb"]')
  gap = parseInt(getComputedStyle(container.value).gap)

  setFillWidth(percent.value)
})

function onDragStart(e: MouseEvent) {
  if (!container.value || !thumb) return

  const { clientX } = e
  const { left } = thumb.getBoundingClientRect()

  thumb_offset = clientX - left

  is_dragging.value = true
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', onDragEnd)
}

function onDragEnd() {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', onDragEnd)

  is_dragging.value = false
  setFillWidth(percent.value!)
}

async function onDrag(e: MouseEvent) {
  if (!container.value || !thumb) return

  const { left, width } = container.value.getBoundingClientRect()
  const { clientX } = e

  const padding = thumb.clientWidth / 2
  const pos = clientX - left - padding
  let ratio = pos / width
  ratio = Math.min(Math.max(ratio, 0), 1)

  const new_percent = ratio * 100
  const rounded = Math.round(new_percent)
  const clamped = Math.min(Math.max(rounded, 0), 100)
  const final = clamped === 0 ? 0 : clamped === 100 ? 100 : new_percent

  percent.value = clamped
  setFillWidth(final)
}

function setFillWidth(new_percent: number) {
  if (!container.value || !fill.value || !thumb) return

  const width = container.value.offsetWidth
  const new_width = width * (new_percent / 100)
  const clamped = Math.min(Math.max(new_width, 0), width - gap)

  fill.value.style.width = `${clamped}px`
}
</script>

<template>
  <div
    ref="container"
    data-testid="ui-kit-slider"
    class="grid grid-cols-[auto_1fr] items-center gap-7.5"
  >
    <div
      ref="fill"
      data-testid="ui-kit-slider__fill"
      class="h-2.5 bg-brown-900 rounded-full relative flex items-center"
    >
      <ui-tooltip
        data-testid="ui-kit-slider__thumb"
        :text="`${percent}%`"
        :visible="is_dragging"
        element="div"
        class="absolute -right-6.5 w-5.5 h-5.5 bg-brown-900 rounded-full shrink-0 cursor-pointer hover:ring-8
          hover:ring-brown-900 transition-all duration-75 z-10"
        @mousedown="onDragStart"
      ></ui-tooltip>
    </div>

    <div
      data-testid="ui-kit-slider__track"
      class="h-2.5 w-full bg-brown-100 rounded-full shrink"
    ></div>

    <!-- <div data-testid="ui-kit-slider__spinbox">
      <input value="5" class="w-7.5 h-7.5 bg-brown-100 rounded-2.5 px-2.5 py-1" />
    </div> -->
  </div>
</template>
