import {
  CoreSnapshot,
  getCoreSnapshotAPI,
  getRuntimeProfileContentAPI,
  getSystemSnapshotAPI,
  SystemSnapshot,
} from '@/api/ipc-invoke'
import { addMessageListener } from '@/api/ipc-message'
import { CORE_SNAPSHOT_CHANGED, CORE_START_LOG, SYSTEM_SNAPSHOT_CHANGED } from '@main/shared/event'
import { ref, watch } from 'vue'
import { ROUTE_NAME } from '../constant'
import router from '../router'
import { activeProfileUuid } from './profiles'
import { addBackend, backendList } from './setup'

export const isCoreRunning = ref(false)
export const isSystemProxyEnabled = ref(false)
export const isAutoLaunchEnabled = ref(false)
export const coreLogs = ref<string[]>([])
export const showCoreStartupModal = ref(false)

watch(showCoreStartupModal, (val) => {
  if (!val) {
    resetCoreLogs()
  }
})

export const resetCoreLogs = () => {
  coreLogs.value = []
}

const applyCoreSnapshot = async ({ isRunning }: CoreSnapshot) => {
  backendList.value = []
  if (isRunning) {
    const runtimeConfigContent = await getRuntimeProfileContentAPI()
    const runtimeConfig = JSON.parse(runtimeConfigContent)

    const externalController =
      runtimeConfig.experimental?.clash_api?.external_controller || '127.0.0.1:9090'
    const [, port] = externalController.split(':')
    const password = runtimeConfig.experimental?.clash_api?.secret || activeProfileUuid.value

    addBackend({
      host: '127.0.0.1',
      port: port || '9090',
      protocol: 'http',
      secondaryPath: '',
      password: password,
    })
  } else {
    router.push({ name: ROUTE_NAME.profiles })
  }
  isCoreRunning.value = isRunning
}

const applySystemSnapshot = (snapshot: SystemSnapshot) => {
  isSystemProxyEnabled.value = snapshot.isSystemProxyEnabled
  isAutoLaunchEnabled.value = snapshot.isAutoLaunchEnabled
}

getCoreSnapshotAPI().then(applyCoreSnapshot)
getSystemSnapshotAPI().then(applySystemSnapshot)

addMessageListener<CoreSnapshot>(CORE_SNAPSHOT_CHANGED, applyCoreSnapshot)
addMessageListener<SystemSnapshot>(SYSTEM_SNAPSHOT_CHANGED, applySystemSnapshot)

addMessageListener<string>(CORE_START_LOG, (log) => {
  if (!showCoreStartupModal.value) {
    showCoreStartupModal.value = true
  }
  coreLogs.value.unshift(log)
})
