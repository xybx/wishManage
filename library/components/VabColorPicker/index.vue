<template>
  <div v-if="'technology' != theme.themeName" class="vab-color-picker" style="margin-left: var(--el-margin)">
    <el-color-picker v-model="color" popper-class="vab-color-picker-popper" :predefine="predefineColors" @active-change="handleChange" />
  </div>
</template>

<script lang="ts" setup>
import { color as _color } from '/@/config/'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabColorPicker',
})

const predefineColors = ref<any>([
  _color,
  '#1e90ff',
  '#4e6ef2',
  '#0052d9',
  '#3fb884',
  '#16baa9',
  '#07c160',
  '#009688',
  '#6954f0',
  '#7b40f2',
  '#f01414',
])
const settingsStore = useSettingsStore()
const { changeColor, getColor } = settingsStore
const { color, theme } = storeToRefs(settingsStore)

const handleChange = (value: any) => {
  color.value = value
  changeColor()
}

onBeforeMount(() => {
  // 还原默认
  $sub('shop-vite-reset-color', () => {
    handleChange(_color)
  })
  $sub('shop-vite-change-color', () => {
    handleChange(color)
  })
  handleChange(getColor)
})
</script>

<style lang="scss">
.vab-color-picker-popper {
  box-sizing: content-box !important;
  padding: calc(var(--el-padding) / 2);

  .el-color-dropdown__link-btn {
    display: none;
  }

  .el-color-dropdown__btns {
    margin-top: 0;
  }
}
</style>
