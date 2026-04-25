import {
  deleteProfileAPI,
  getProfilesSnapshotAPI,
  ProfilesSnapshot,
  saveProfileAPI,
  setActiveProfileAPI,
  updateProfileAPI,
  updateRemoteProfileAPI,
} from '@/api/ipc-invoke'
import { addMessageListener } from '@/api/ipc-message'
import { PROFILES_SNAPSHOT_CHANGED } from '@main/shared/event'
import { Profile } from '@main/shared/type'
import { computed, ref } from 'vue'

export const profileList = ref<Profile[]>([])

const applyProfilesSnapshot = (snapshot: ProfilesSnapshot) => {
  profileList.value = snapshot.profiles
}

getProfilesSnapshotAPI().then(applyProfilesSnapshot)

addMessageListener<ProfilesSnapshot>(PROFILES_SNAPSHOT_CHANGED, applyProfilesSnapshot)

export const activeProfileUuid = computed(
  () => profileList.value.find((f) => f.isActive)?.uuid || '',
)
export const saveProfile = async (profile: Profile, content?: string) => {
  await saveProfileAPI(profile, content)
}
export const deleteProfile = async (profileUuid: string) => {
  await deleteProfileAPI(profileUuid)
}
export const updateProfile = async (profile: Partial<Profile> & { uuid: string }) => {
  await updateProfileAPI(profile)
}
export const updateRemoteProfile = async (profileUuid: string) => {
  await updateRemoteProfileAPI(profileUuid)
}
export const setActiveProfile = async (profileUuid: string) => {
  await setActiveProfileAPI(profileUuid)
}
