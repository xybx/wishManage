<template>
  <component :is="menuComponent" :item-or-menu="item">
    <template v-if="item.children && item.children.length > 0">
      <vab-menu v-for="route in item.children" :key="route.path" :item="route" />
    </template>
  </component>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabMenu',
})

interface ComponentType {
  default: Component
}

const imports = import.meta.glob<ComponentType>('./**/*.vue', { eager: true })
const Components: Record<string, Component> = {}
Object.getOwnPropertyNames(imports).forEach((key) => {
  Components[key.replaceAll(/(\/|components|\.|vue)/g, '')] = imports[key].default
})

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  layout: {
    type: String,
    default: '',
  },
})

const menuComponent = computed(() =>
  props.item.children &&
  props.item.children.some((route: any) => {
    return route.meta && route.meta.hidden !== true
  })
    ? Components['VabSubMenu']
    : Components['VabMenuItem']
)
</script>
