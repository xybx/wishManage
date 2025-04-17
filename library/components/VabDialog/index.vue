<template>
  <el-dialog
    v-model="dialogVisible"
    :align-center="alignCenter"
    :append-to="appendTo"
    :append-to-body="appendToBody"
    :before-close="beforeClose"
    :center="center"
    :class="'vab-dialog-' + theme"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :destroy-on-close="destroyOnClose"
    :draggable="draggable"
    :fullscreen="isFullscreen"
    :lock-scroll="lockScroll"
    :modal="modal"
    :modal-class="modalClass"
    :open-delay="openDelay"
    :overflow="overflow"
    :show-close="showClose"
    :style="{
      transition: animated ? 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),transform 0s' : '',
    }"
    :top="top"
    :width="width"
    v-bind="$attrs"
  >
    <template #header>
      <slot name="header">
        <div class="el-dialog__title" @dblclick="setFullscreen">{{ title }}</div>
      </slot>
      <button v-if="showClose" class="el-dialog__headerbtn" type="button" @click="closeDialog">
        <el-icon class="el-dialog__close">
          <close />
        </el-icon>
      </button>
      <button v-if="showFullscreen" class="el-dialog__headerbtn" style="right: 51px" type="button" @click="setFullscreen">
        <vab-icon class="el-dialog__close el-dialog__fullscreen" :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'" />
      </button>
    </template>
    <div v-loading="loading">
      <slot></slot>
    </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'

defineOptions({
  name: 'VabDialog',
})

const props = defineProps({
  ...ElDialog.props,
  modelValue: {
    type: Boolean,
    default: false,
  },
  showFullscreen: {
    type: Boolean,
    default: true,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  animated: {
    type: Boolean,
    default: true,
  },
  closeOnClickModal: {
    type: Boolean,
    default: false,
  },
  closeOnPressEscape: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: 'default', //支持default、plain、primary三种
  },
  draggable: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const dialogVisible = useVModel(props, 'modelValue', emit)
const isFullscreen = ref<any>(false)

const closeDialog = () => {
  dialogVisible.value = false
  isFullscreen.value = false
}

const setFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

watch(
  props,
  () => {
    isFullscreen.value = props.fullscreen
  },
  {
    immediate: true,
  }
)
</script>
