<template>
  <div
    class="border-base-300 scrollbar-hidden flex items-center gap-1 overflow-x-auto border-b px-2 py-1.5"
  >
    <FolderItem
      :id="VIRTUAL_ALL"
      :label="$t('folder_all')"
      :count="totalCount"
      :is-active="activeFolderId === VIRTUAL_ALL"
      orientation="horizontal"
      icon="all"
      @activate="activeFolderId = VIRTUAL_ALL"
    />
    <FolderItem
      v-for="f in foldersSorted"
      :key="f.id"
      :id="f.id"
      :label="displayFolderName(f.name)"
      :count="folderCount(f.id)"
      :is-active="activeFolderId === f.id"
      orientation="horizontal"
      icon="folder"
      @activate="activeFolderId = f.id"
    />
    <FolderItem
      :id="VIRTUAL_UNCAT"
      :label="$t('folder_uncategorized')"
      :count="folderCount(VIRTUAL_UNCAT)"
      :is-active="activeFolderId === VIRTUAL_UNCAT"
      orientation="horizontal"
      icon="uncategorized"
      @activate="activeFolderId = VIRTUAL_UNCAT"
    />
    <button
      class="btn btn-ghost btn-sm ml-auto shrink-0"
      @click="folderManagerOpen = true"
      :title="$t('folder_manage')"
    >
      <Cog6ToothIcon class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { proxyGroupList } from '@/store/proxies'
import {
  activeFolderId,
  folderCount,
  folderManagerOpen,
  folders,
  VIRTUAL_ALL,
  VIRTUAL_UNCAT,
} from '@/store/proxyFolders'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import FolderItem from './FolderItem.vue'
import { displayFolderName } from './folderName'

const foldersSorted = computed(() => [...folders.value].sort((a, b) => a.order - b.order))
const totalCount = computed(() => proxyGroupList.value.length)
</script>
