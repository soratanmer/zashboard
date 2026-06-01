<template>
  <aside
    class="border-base-300 flex h-full w-44 shrink-0 flex-col border-r transition-all duration-200"
  >
    <div class="flex-1 overflow-y-auto p-2">
      <div class="flex flex-col gap-1">
        <FolderItem
          :id="VIRTUAL_ALL"
          :label="$t('folder_all')"
          :count="totalCount"
          :is-active="activeFolderId === VIRTUAL_ALL"
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
          icon="folder"
          @activate="activeFolderId = f.id"
        />
        <FolderItem
          :id="VIRTUAL_UNCAT"
          :label="$t('folder_uncategorized')"
          :count="folderCount(VIRTUAL_UNCAT)"
          :is-active="activeFolderId === VIRTUAL_UNCAT"
          icon="uncategorized"
          @activate="activeFolderId = VIRTUAL_UNCAT"
        />
      </div>
    </div>
    <button
      class="btn btn-ghost btn-sm m-2 justify-start gap-2"
      :class="folderManagerOpen ? 'bg-base-200' : ''"
      @click="folderManagerOpen = !folderManagerOpen"
    >
      <Cog6ToothIcon class="h-4 w-4" />
      {{ $t('folder_manage') }}
    </button>
  </aside>
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
