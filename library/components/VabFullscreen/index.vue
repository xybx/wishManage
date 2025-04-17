<template>
  <vab-icon class="vab-fullscreen" :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'" @click="toggle" />
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabFullscreen',
})

const { isFullscreen, toggle } = useFullscreen()
</script>
