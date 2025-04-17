<template>
  <vab-icon :class="className" icon="refresh-line" @click="refreshRoute" />
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabRefresh',
})

const className = ref<string>('')

const rotate = () => {
  className.value = 'rotate'
  setTimeout(() => {
    className.value = ''
  }, 500)
}

const refreshRoute = () => {
  $pub('reload-router-view')
  rotate()
}

onBeforeMount(() => {
  $sub('refresh-rotate', () => {
    rotate()
  })
})
</script>
