<template>
  <!-- PC: inline slide-out aside -->
  <aside
    v-if="!isMiddleScreen"
    class="border-base-300 flex h-full flex-col overflow-hidden border-r transition-all duration-200"
    :class="folderManagerOpen ? 'w-80' : 'w-0'"
  >
    <FolderManagerContent v-if="folderManagerOpen" />
  </aside>

  <!-- Mobile: dialog -->
  <DialogWrapper
    v-else
    v-model="folderManagerOpen"
    :title="$t('folder_manage')"
    box-class="!max-w-full"
  >
    <FolderManagerContent />
  </DialogWrapper>
</template>

<script setup lang="ts">
import { isMiddleScreen } from '@/helper/utils'
import { folderManagerOpen } from '@/store/proxyFolders'
import DialogWrapper from '../../common/DialogWrapper.vue'
import FolderManagerContent from './FolderManagerContent.vue'
</script>
