import { setSystemProxyAPI, startCoreAPI, stopCoreAPI, unsetSystemProxyAPI } from '@/api/ipc-invoke'
import { coreLogs, isCoreRunning, isSystemProxyEnabled, showCoreStartupModal } from '@/store/status'
import { ref, watch } from 'vue'

export const useAppOverview = () => {
  const isCoreRunningLocal = ref(isCoreRunning.value)
  const isSystemProxyEnabledLocal = ref(isSystemProxyEnabled.value)

  watch(isCoreRunning, (newVal) => {
    isCoreRunningLocal.value = newVal
  })

  watch(isSystemProxyEnabled, (newVal) => {
    isSystemProxyEnabledLocal.value = newVal
  })

  watch(
    coreLogs,
    (newVal) => {
      if (newVal.length > 0) {
        showCoreStartupModal.value = true
      }
    },
    { deep: true },
  )

  const toggleCoreRunning = async () => {
    if (!isCoreRunningLocal.value) {
      showCoreStartupModal.value = true
      await startCoreAPI()
    } else {
      await stopCoreAPI()
    }
  }

  const toggleSystemProxy = async () => {
    if (!isSystemProxyEnabledLocal.value) {
      await setSystemProxyAPI()
    } else {
      await unsetSystemProxyAPI()
    }
  }

  const stopCore = () => {
    isCoreRunningLocal.value = false
  }

  return {
    isCoreRunning,
    isCoreRunningLocal,
    isSystemProxyEnabled,
    isSystemProxyEnabledLocal,
    showCoreStartupModal,
    stopCore,
    toggleCoreRunning,
    toggleSystemProxy,
  }
}
