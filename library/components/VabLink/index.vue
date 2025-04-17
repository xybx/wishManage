<template>
  <component :is="type" v-bind="linkProps()">
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
import { isExternal } from '/@/utils/validate'

defineOptions({
  name: 'VabLink',
})

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    default: '',
  },
})

const type = computed(() => (isExternal(props.to) ? 'a' : 'router-link'))

const linkProps = () =>
  isExternal(props.to)
    ? {
        href: props.to,
        target: '_blank',
        rel: 'noopener',
      }
    : { to: props.to, target: props.target }
</script>
