<template>
  <div class="flex flex-col gap-2 p-2 text-sm">
    <SidebarStatistics />
    <div class="flex gap-2">
      <BackendVersion />
    </div>
  </div>
</template>

<script setup lang="ts">
import BackendVersion from '../common/BackendVersion.vue'
import SidebarStatistics from './SidebarStatistics.vue'
</script>
