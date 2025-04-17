<template>
  <blockquote
    v-if="blockquote"
    class="vab-blockquote"
    :class="isBorder ? 'vab-blockquote-' + type + ' is-border' : 'vab-blockquote-' + type"
  >
    <slot></slot>
  </blockquote>
  <fieldset v-else-if="fieldset" class="vab-fieldset">
    <legend>{{ title }}</legend>
    <slot></slot>
  </fieldset>
  <el-divider v-else :border-style="borderStyle" :content-position="contentPosition" :direction="direction">
    <template #default>
      <slot></slot>
    </template>
  </el-divider>
</template>

<script lang="ts" setup>
import { ElDivider } from 'element-plus'

defineOptions({
  name: 'VabDivider',
})

defineProps({
  ...ElDivider.props,
  blockquote: {
    type: Boolean,
    default: false,
  },
  fieldset: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'primary', // 类型： primary / success / warning / danger / info
  },
  isBorder: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
.vab-blockquote {
  width: 100%;
  padding: 15px;
  margin: 0 0 10px 0;
  line-height: 1.8;
  background-color: var(--el-background-color);
  border-left: 5px solid var(--el-color-primary);
  border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base) 0;

  &-primary {
    border-left: 5px solid var(--el-color-primary);
  }

  &-success {
    border-left: 5px solid var(--el-color-success);
  }

  &-warning {
    border-left: 5px solid var(--el-color-warning);
  }

  &-danger {
    border-left: 5px solid var(--el-color-danger);
  }

  &-info {
    border-left: 5px solid var(--el-color-info);
  }

  &.is-border {
    border-top: 1px solid var(--el-border-color);
    border-right: 1px solid var(--el-border-color);
    border-bottom: 1px solid var(--el-border-color);
  }
}

.vab-fieldset {
  padding: var(--el-padding);
  margin-bottom: 10px;
  border: 1px solid var(--el-border-color);

  legend {
    padding: 0 var(--el-padding) 0 var(--el-padding);
  }
}
</style>
