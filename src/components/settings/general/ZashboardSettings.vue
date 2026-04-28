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

    <BackendSettings />
    <template v-if="isVisibleActions">
      <div class="settings-section-label">
        {{ $t('actions') }}
      </div>
      <div class="settings-grid">
        <div class="setting-item">
          <div class="setting-item-label">
            {{ $t('dashboardSettings') }}
          </div>
          <DashboardSettings />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">
            {{ $t('autoLaunch') }}
          </div>
          <input
            :checked="isAutoLaunchEnabled"
            type="checkbox"
            class="toggle"
            @change="toggleAutoLaunch"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">
            {{ $t('autoSystemProxy') }}
          </div>
          <input
            v-model="autoSystemProxy"
            type="checkbox"
            class="toggle"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">
            {{ $t('clearRuntimeDir') }}
          </div>
          <button
            class="btn btn-sm"
            @click="handleClearRuntimeDir"
          >
            {{ $t('clear') }}
          </button>
        </div>
        <div class="setting-item">
          <div class="setting-item-label">
            {{ $t('updateCore') }}
          </div>
          <button
            class="btn btn-sm"
            @click="showCoreUpdateModal = true"
          >
            {{ $t('updateCore') }}
          </button>
        </div>
      </div>
    </template>

    <StyleSettings />
    <GeneralSettings />
    <CoreUpdateModal v-model="showCoreUpdateModal" />
  </div>
</template>

<script setup lang="ts">
import { clearRuntimeDirAPI, disableAutoLaunchAPI, enableAutoLaunchAPI } from '@/api/ipc-invoke'
import { useIsSettingVisible } from '@/composables/settings'
import { GENERAL_ITEM_KEYS } from '@/config/settingsItems'
import { autoSystemProxy } from '@/store/settings'
import { isAutoLaunchEnabled } from '@/store/status'
import { ref } from 'vue'
import DashboardSettings from '../../common/DashboardSettings.vue'
import CoreUpdateModal from '../../modals/CoreUpdateModal.vue'
import BackendSettings from '../backend/BackendSettings.vue'
import GeneralSettings from './GeneralSettings.vue'
import StyleSettings from './StyleSettings.vue'

const k = GENERAL_ITEM_KEYS
const isVisibleActions = useIsSettingVisible(k.actions)

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
