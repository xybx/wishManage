<template>
  <vab-dialog v-model="drawerVisible" append-to-body :title="translate('标签设置')" width="400px">
    <el-form ref="form" label-position="top" :model="theme">
      <el-form-item v-if="theme.showTabs" :label="translate('标签风格')">
        <el-radio-group v-model="theme.tabsBarStyle">
          <el-radio-button v-for="item in tabsBarStyleList" :key="item.value" :label="translate(item.label)" :value="item.value" />
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="translate('标签图标')">
        <el-switch v-model="theme.showTabsIcon" />
      </el-form-item>
      <el-form-item :label="translate('持久化标签')">
        <el-switch v-model="persistenceTab" @change="handlePersistenceTab" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSaveTheme">
        {{ translate('保存') }}
      </el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { translate } from '/@/i18n'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabTabsSetting',
})

const settingsStore = useSettingsStore()
const { theme, persistenceTab } = storeToRefs(settingsStore)
const { saveTheme, updateCaughtTabs } = settingsStore
const drawerVisible = ref<boolean>(false)
const tabsBarStyleList = ref<any>([
  { label: '卡片', value: 'card' },
  { label: '灵动', value: 'smart' },
  { label: '圆滑', value: 'smooth' },
  { label: '矩形', value: 'rect' },
])

const handleOpenSetting = () => {
  drawerVisible.value = true
}

defineExpose({
  handleOpenSetting,
})

const handlePersistenceTab = (value: any) => {
  updateCaughtTabs(value)
}

const handleSaveTheme = () => {
  saveTheme()
  drawerVisible.value = false
}
</script>
