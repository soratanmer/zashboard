<template>
  <div
    class="fixed right-4 bottom-[calc(var(--spacing)*4+env(safe-area-inset-bottom))] z-30 flex flex-col gap-2"
  >
    <button
      class="btn btn-circle shadow-lg"
      :class="isCoreRunning ? 'btn-primary' : 'btn-neutral'"
      :aria-label="$t('coreStatus')"
      @click="toggleCoreRunning"
      @mouseenter="(e) => showActionTip(e, 'coreStatus')"
      @mouseleave="hideTip"
    >
      <PowerIcon class="h-5 w-5" />
      <span
        v-if="isCoreRunning"
        class="bg-success absolute top-1 right-1 size-2 rounded-full"
      />
    </button>
    <button
      class="btn btn-circle shadow-lg"
      :class="isSystemProxyEnabled ? 'btn-primary' : 'btn-neutral'"
      :aria-label="$t('systemProxy')"
      @click="toggleSystemProxy"
      @mouseenter="(e) => showActionTip(e, 'systemProxy')"
      @mouseleave="hideTip"
    >
      <GlobeAltIcon class="h-5 w-5" />
      <span
        v-if="isSystemProxyEnabled"
        class="bg-success absolute top-1 right-1 size-2 rounded-full"
      />
    </button>

    <CoreStartupModal
      v-model="showCoreStartupModal"
      @stopCore="stopCore"
    />
  </div>
</template>

<script setup lang="ts">
import { useAppOverview } from '@/composables/appOverview'
import { useTooltip } from '@/helper/tooltip'
import { GlobeAltIcon, PowerIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import CoreStartupModal from '../modals/CoreStartupModal.vue'

const {
  isCoreRunning,
  isSystemProxyEnabled,
  showCoreStartupModal,
  stopCore,
  toggleCoreRunning,
  toggleSystemProxy,
} = useAppOverview()

const { t } = useI18n()
const { showTip, hideTip } = useTooltip()

const showActionTip = (e: MouseEvent, key: string) => {
  showTip(e, t(key), {
    placement: 'left',
  })
}
</script>
