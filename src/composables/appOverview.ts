import { setSystemProxyAPI, startCoreAPI, stopCoreAPI, unsetSystemProxyAPI } from '@/api/ipc-invoke'
import { useNotification } from '@/composables/notification'
import { coreLogs, isCoreRunning, isSystemProxyEnabled, showCoreStartupModal } from '@/store/status'
import { ref, watch } from 'vue'

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

export const useAppOverview = () => {
  const { showNotification } = useNotification()
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
    try {
      if (!isCoreRunningLocal.value) {
        showCoreStartupModal.value = true
        await startCoreAPI()
      } else {
        await stopCoreAPI()
      }
    } catch (error) {
      isCoreRunningLocal.value = isCoreRunning.value
      showNotification({
        message: getErrorMessage(error),
        type: 'alert-error',
        timeout: 5000,
      })
    }
  }

  const toggleSystemProxy = async () => {
    try {
      if (!isSystemProxyEnabledLocal.value) {
        await setSystemProxyAPI()
      } else {
        await unsetSystemProxyAPI()
      }
    } catch (error) {
      isSystemProxyEnabledLocal.value = isSystemProxyEnabled.value
      showNotification({
        message: getErrorMessage(error),
        type: 'alert-error',
        timeout: 5000,
      })
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
