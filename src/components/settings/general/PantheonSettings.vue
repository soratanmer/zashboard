<template>
  <div class="relative flex flex-col text-sm">
    <div class="flex items-center gap-2 px-1">
      <a
        href="https://github.com/Zephyruso/Pantheon"
        target="_blank"
        class="text-lg font-semibold"
      >
        Pantheon
        <span class="text-sm font-normal opacity-50">
          {{ appVersion }}
        </span>
      </a>
    </div>

    <div class="settings-grid my-3 gap-2 p-3 md:grid-cols-2!">
      <label class="label cursor-pointer justify-between gap-3 rounded-xl border px-3 py-2">
        <span>{{ $t('autoLaunch') }}</span>
        <input
          :checked="isAutoLaunchEnabled"
          type="checkbox"
          class="toggle toggle-sm"
          @change="toggleAutoLaunch"
        />
      </label>
      <label class="label cursor-pointer justify-between gap-3 rounded-xl border px-3 py-2">
        <span>{{ $t('autoSystemProxy') }}</span>
        <input
          v-model="autoSystemProxy"
          type="checkbox"
          class="toggle toggle-sm"
        />
      </label>
      <button
        class="btn btn-neutral btn-sm"
        @click="handleClearRuntimeDir"
      >
        {{ $t('clearRuntimeDir') }}
      </button>
      <button
        class="btn btn-neutral btn-sm"
        @click="showCoreUpdateModal = true"
      >
        {{ $t('updateCore') }}
      </button>
    </div>

    <CoreUpdateModal v-model="showCoreUpdateModal" />
  </div>
</template>

<script setup lang="ts">
import {
  clearRuntimeDirAPI,
  disableAutoLaunchAPI,
  enableAutoLaunchAPI,
} from '@/api/ipc-invoke'
import { autoSystemProxy } from '@/store/settings'
import { isAutoLaunchEnabled } from '@/store/status'
import { ref } from 'vue'
import CoreUpdateModal from '../../modals/CoreUpdateModal.vue'

const appVersion = __APP_VERSION__
const showCoreUpdateModal = ref(false)

const handleClearRuntimeDir = async () => {
  await clearRuntimeDirAPI()
}

const toggleAutoLaunch = async () => {
  if (isAutoLaunchEnabled.value) {
    await disableAutoLaunchAPI()
    return
  }
  await enableAutoLaunchAPI()
}
</script>
