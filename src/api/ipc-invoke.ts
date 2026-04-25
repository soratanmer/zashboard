import { Profile, SettingsKey, SettingsValue } from '@main/shared/type'

const { pantheon } = window

export type CoreSnapshot = {
  isRunning: boolean
  version: string
}

export type ProfilesSnapshot = {
  profiles: Profile[]
  activeProfileUuid: string
}

export type SystemSnapshot = {
  isAutoLaunchEnabled: boolean
  isSystemProxyEnabled: boolean
}

export const getCoreSnapshotAPI = async (): Promise<CoreSnapshot> => {
  return await pantheon.core.getSnapshot()
}

export const startCoreAPI = async (): Promise<void> => {
  return await pantheon.core.start()
}
export const stopCoreAPI = async (): Promise<void> => {
  return await pantheon.core.stop()
}

export const enableAutoLaunchAPI = async (): Promise<void> => {
  return await pantheon.autoLaunch.enable()
}
export const disableAutoLaunchAPI = async (): Promise<void> => {
  return await pantheon.autoLaunch.disable()
}

export const getActiveProfileUuidAPI = async (): Promise<string> => {
  return await pantheon.profiles.getActive()
}
export const getProfilesSnapshotAPI = async (): Promise<ProfilesSnapshot> => {
  return await pantheon.profiles.getSnapshot()
}
export const setActiveProfileAPI = async (profileUuid: string): Promise<void> => {
  return await pantheon.profiles.setActive(profileUuid)
}
export const saveProfileAPI = async (profile: Profile, content?: string): Promise<void> => {
  return await pantheon.profiles.save(profile, content)
}
export const updateRemoteProfileAPI = async (profileUuid: string): Promise<void> => {
  return await pantheon.profiles.updateRemote(profileUuid)
}
export const updateProfileAPI = async (
  profile: Partial<Profile> & { uuid: string },
): Promise<void> => {
  return await pantheon.profiles.update(profile)
}
export const deleteProfileAPI = async (profileUuid: string): Promise<void> => {
  return await pantheon.profiles.delete(profileUuid)
}
export const checkProfileContentAPI = async (content: string): Promise<string | number> => {
  return await pantheon.profiles.checkContent(content)
}

export const getProfileContentAPI = async (profileUuid: string): Promise<string> => {
  return await pantheon.profiles.getContent(profileUuid)
}
export const writeProfileContentAPI = async (
  profileUuid: string,
  profile: string,
): Promise<void> => {
  return await pantheon.profiles.setContent(profileUuid, profile)
}

export const getRuntimeProfileContentAPI = async (): Promise<string> => {
  return await pantheon.profiles.getRuntimeContent()
}

// 系统代理相关API
export const setSystemProxyAPI = async (): Promise<void> => {
  return await pantheon.systemProxy.set()
}
export const unsetSystemProxyAPI = async (): Promise<void> => {
  return await pantheon.systemProxy.unset()
}

export const getSystemSnapshotAPI = async (): Promise<SystemSnapshot> => {
  return await pantheon.system.getSnapshot()
}

// 设置相关API
export const updateSettingsAPI = async (key: SettingsKey, value: SettingsValue): Promise<void> => {
  return await pantheon.settings.update(key, value)
}

export const clearRuntimeDirAPI = async (): Promise<void> => {
  return await pantheon.runtime.clearDir()
}

const toIpcValue = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T
}

export const updateTrayStoreAPI = async (
  key: 'proxyGroups' | 'config',
  value: unknown,
): Promise<void> => {
  return await pantheon.tray.updateStore(key, toIpcValue(value))
}

// 内核更新相关API
export const updateCoreFromOfficialAPI = async (): Promise<string> => {
  return await pantheon.core.updateFromOfficial()
}

export const updateCoreFromFileAPI = async (filePath: string): Promise<string> => {
  return await pantheon.core.updateFromFile(filePath)
}

export const selectCoreFileAPI = async (): Promise<string | null> => {
  return await pantheon.core.selectFile()
}

type JsonSchemaAPIResult = {
  success: boolean
  data?: unknown
  error?: string
}

export const fetchJsonSchemaAPI = async (): Promise<JsonSchemaAPIResult> => {
  return await pantheon.profiles.fetchJsonSchema()
}
