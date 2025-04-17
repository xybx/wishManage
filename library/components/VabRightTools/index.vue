<template>
  <div class="vab-right-tools">
    <vab-dark v-show="theme.showDark" :style="!isHorizontal ? '' : { marginLeft: 'var(--el-margin)' }" />
    <vab-color-picker v-show="theme.showColorPicker" />
    <vab-theme v-show="theme.showTheme && routeName !== 'SeparateLayout'" />
    <!--<vab-error-log class="hidden-xs-only" />-->
    <vab-lock v-show="theme.showLock" />
    <vab-language v-show="theme.showLanguage" />
    <vab-fullscreen v-show="theme.showFullScreen" />
    <vab-refresh v-show="theme.showRefresh" />
    <vab-avatar v-show="theme.showAvatar" @getUser="getUser" @getPass="getPass" />
    <VabOther v-model:dialogVisible="dialogVisible" v-model:dialogList="dialogList" />
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'
import type {DialogProps} from "/@/types/listTypes.ts";
defineOptions({
  name: 'VabRightTools',
})
const dialogVisible = ref<boolean>(false);
const dialogList = ref<DialogProps>({});
defineProps({
  isHorizontal: {
    type: Boolean,
    default: false,
  },
})
const route = useRoute()
const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
const routeName = ref<any>(route.name)
watch(
  route,
  () => {
    routeName.value = route.name
  },
  { immediate: true }
)

const getUser = ()=>{
  dialogList.value.modeType = "user";
  dialogList.value.title = "个人信息";
  dialogVisible.value = true;
}

const getPass = ()=>{
  dialogList.value.modeType = "pass";
  dialogList.value.title = "修改密码";
  dialogVisible.value = true;
}


</script>

<style lang="scss" scoped>
.vab-right-tools {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
