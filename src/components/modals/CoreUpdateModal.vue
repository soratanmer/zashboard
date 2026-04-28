<template>
  <DialogWrapper v-model="isOpen">
    <h3 class="text-lg font-bold">{{ $t('updateCore') }}</h3>
    <p class="py-4">{{ $t('updateCoreDescription') }}</p>

    <div class="flex flex-col gap-4">
      <!-- 官方更新按钮 -->
      <button
        class="btn btn-primary"
        :disabled="isUpdating"
        @click="handleOfficialUpdate"
      >
        <span
          v-if="updatingType === 'official'"
          class="loading loading-spinner loading-sm"
        ></span>
        {{ $t('updateFromOfficial') }}
      </button>

      <!-- 手动上传按钮 -->
      <button
        v-if="updatingType !== 'official'"
        class="btn"
        :disabled="isUpdating"
        @click="handleFileUpload"
      >
        <span
          v-if="updatingType === 'file'"
          class="loading loading-spinner loading-sm"
        ></span>
        {{ $t('updateFromFile') }}
      </button>

      <div
        v-if="updatingType === 'official' && progress"
        class="bg-base-200 flex flex-col gap-2 rounded-lg p-3 text-sm"
      >
        <div class="flex items-center justify-between">
          <span class="font-medium">
            {{ progressPhaseLabel }}
          </span>
          <span class="font-mono text-xs opacity-70">v{{ progress.version }}</span>
        </div>

        <progress
          class="progress progress-primary w-full"
          :value="progressPercent ?? undefined"
          :max="progressPercent !== null ? 100 : undefined"
        ></progress>

        <div class="flex items-center justify-between font-mono text-xs opacity-80">
          <span>
            {{ formatBytes(progress.downloaded) }}
            <template v-if="progress.total > 0">/ {{ formatBytes(progress.total) }}</template>
            <template v-if="progressPercent !== null"> ({{ progressPercent }}%)</template>
          </span>
          <span v-if="progress.phase === 'downloading'">{{ formatBytes(progress.speed) }}/s</span>
        </div>
      </div>
    </div>
  </DialogWrapper>
</template>

<script setup lang="ts">
import {
  selectCoreFileAPI,
  updateCoreFromFileAPI,
  updateCoreFromOfficialAPI,
} from '@/api/ipc-invoke'
import { addMessageListener } from '@/api/ipc-message'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import { useNotification } from '@/composables/notification'
import { CORE_UPDATE_PROGRESS } from '@main/shared/event'
import type { CoreUpdateProgress } from '@main/shared/type'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const isOpen = defineModel<boolean>('modelValue', { required: true })
const updatingType = ref<'official' | 'file' | null>(null)
const progress = ref<CoreUpdateProgress | null>(null)

const isUpdating = computed(() => updatingType.value !== null)

const { t } = useI18n()
const { showNotification } = useNotification()

const unsubscribeProgress = addMessageListener<CoreUpdateProgress>(
  CORE_UPDATE_PROGRESS,
  (payload) => {
    if (updatingType.value !== 'official') return
    progress.value = payload
  },
)

onBeforeUnmount(() => {
  unsubscribeProgress()
})

const progressPercent = computed(() => {
  if (!progress.value || progress.value.total <= 0) return null
  return Math.min(100, Math.floor((progress.value.downloaded / progress.value.total) * 100))
})

const progressPhaseLabel = computed(() => {
  if (!progress.value) return ''
  switch (progress.value.phase) {
    case 'preparing':
      return t('preparingDownload')
    case 'downloading':
      return t('downloadingCore')
    case 'installing':
      return t('installingCore')
    default:
      return ''
  }
})

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

const finishUpdate = () => {
  updatingType.value = null
  progress.value = null
}

const handleCoreUpdateSuccess = (message: string) => {
  isOpen.value = false
  finishUpdate()
  showNotification({
    message: message,
    type: 'alert-success',
  })
}

const handleCoreUpdateError = (error: string) => {
  isOpen.value = false
  finishUpdate()
  showNotification({
    message: error,
    type: 'alert-error',
  })
}

const handleOfficialUpdate = async () => {
  if (isUpdating.value) return

  updatingType.value = 'official'
  progress.value = null
  try {
    const result = await updateCoreFromOfficialAPI()
    handleCoreUpdateSuccess(result)
  } catch (error) {
    handleCoreUpdateError(error instanceof Error ? error.message : String(error))
  } finally {
    finishUpdate()
  }
}

const handleFileUpload = async () => {
  if (isUpdating.value) return

  try {
    const filePath = await selectCoreFileAPI()
    if (filePath) {
      updatingType.value = 'file'
      const result = await updateCoreFromFileAPI(filePath)
      handleCoreUpdateSuccess(result)
    }
  } catch (error) {
    handleCoreUpdateError(error instanceof Error ? error.message : String(error))
  } finally {
    finishUpdate()
  }
}
</script>
