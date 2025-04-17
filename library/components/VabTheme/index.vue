<template>
  <vab-icon icon="t-shirt-line" @click="handleOpenTheme" />
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabTheme',
})

const handleOpenTheme = () => {
  $pub('shop-vite-open-theme')
}
</script>
