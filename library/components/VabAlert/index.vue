<template>
  <el-alert
    :center="center"
    :closable="closable"
    :close-text="closeText"
    :description="description"
    :effect="effect"
    :show-icon="showIcon"
    :title="title"
    :type="type"
    v-bind="$attrs"
  >
    <template v-if="title || $slots.title" #title>
      <slot name="title">
        {{ title }}
      </slot>
    </template>
    <template v-if="$slots.default || description" #default>
      <slot name="default">
        {{ description }}
      </slot>
    </template>
  </el-alert>
</template>

<script lang="ts" setup>
import { ElAlert } from 'element-plus'

defineOptions({
  name: 'VabAlert',
})

defineProps({
  ...ElAlert.props,
  closable: {
    type: Boolean,
    default: false,
  },
})
</script>
