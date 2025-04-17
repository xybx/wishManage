<template>
  <el-card :body-class="bodyClass" :body-style="bodyStyle" class="vab-card" :shadow="shadow" :title="title">
    <template v-if="$slots.header || title" #header>
      <slot v-if="$slots.header" name="header"></slot>
      <template v-else>
        {{ title }}
      </template>
    </template>
    <el-skeleton v-if="skeleton" animated :loading="skeletonShow" :rows="skeletonRows">
      <template #default>
        <slot></slot>
      </template>
    </el-skeleton>
    <slot v-else></slot>
    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { ElCard } from 'element-plus'

defineOptions({
  name: 'VabCard',
})

defineProps({
  ...ElCard.props,
  shadow: {
    type: String,
    default: 'never',
  },
  skeleton: {
    type: Boolean,
    default: false,
  },
  skeletonRows: {
    type: Number,
    default: 5, //显示的数量会比传入的数量多 1
  },
  title: {
    type: String,
    default: '',
  },
  calss: {
    type: String,
    default: '',
  },
})

const skeletonShow = ref<boolean>(true)

const timer: any = setTimeout(() => {
  skeletonShow.value = false
}, 500)

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style lang="scss" scoped>
.vab-card {
  :deep() {
    .el-card__header {
      font-weight: 500;

      [class*='ri-'] {
        background-image: linear-gradient(120deg, #bd34fe 30%, var(--el-color-primary));
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .el-skeleton {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
