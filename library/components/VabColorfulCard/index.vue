<template>
  <el-card
    :body-style="bodyStyle"
    class="vab-colorful-card"
    :shadow="shadow"
    :style="
      style
        ? style
        : {
            background: `linear-gradient(120deg, ${colorFrom} 10%, ${colorTo})`,
          }
    "
  >
    <template v-if="$slots.header" #header>
      <slot name="header"></slot>
    </template>
    <vab-icon v-if="icon" :icon="icon" />
    <slot></slot>
  </el-card>
</template>

<script lang="ts" setup>
import { ElCard } from 'element-plus'

defineOptions({
  name: 'VabColorfulCard',
})

defineProps({
  ...ElCard.props,
  shadow: {
    type: String,
    default: 'never',
  },
  colorFrom: {
    type: String,
    default: '',
  },
  colorTo: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  style: {
    type: Object,
    default: () => {},
  },
})
</script>

<style lang="scss" scoped>
.vab-colorful-card {
  position: relative;
  min-height: 120px;
  cursor: pointer;

  :deep() {
    .el-card__header {
      color: var(--el-color-white);
    }
  }

  i {
    position: absolute;
    right: 20px;
    font-size: 60px;
    transform: rotate(15deg);
  }
}
</style>
