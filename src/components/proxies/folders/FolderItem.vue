<template>
  <button
    class="group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors"
    :class="[
      orientation === 'horizontal' ? 'shrink-0' : 'w-full text-left',
      isActive ? 'bg-primary/15 text-primary' : 'hover:bg-base-200',
    ]"
    @click="$emit('activate')"
  >
    <component
      v-if="iconComponent"
      :is="iconComponent"
      class="h-4 w-4 shrink-0"
    />
    <span class="truncate">{{ label }}</span>
    <span
      v-if="count !== undefined"
      class="text-base-content/60 ml-auto shrink-0 text-xs tabular-nums"
    >
      {{ count }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { FolderIcon, FolderOpenIcon, InboxIcon, Squares2X2Icon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps<{
  id: string
  label: string
  count?: number
  isActive?: boolean
  orientation?: 'vertical' | 'horizontal'
  icon?: 'all' | 'folder' | 'uncategorized'
}>()

defineEmits<{ (e: 'activate'): void }>()

const iconComponent = computed(() => {
  if (props.icon === 'all') return Squares2X2Icon
  if (props.icon === 'uncategorized') return InboxIcon
  if (props.icon === 'folder') return props.isActive ? FolderOpenIcon : FolderIcon
  return null
})
</script>
