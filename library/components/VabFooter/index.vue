<template>
  <footer v-if="theme.showFooter" class="vab-footer">
    Copyright
    <vab-icon icon="copyright-line" />
    {{ fullYear }} {{ title }}

    <a
      v-if="beian"
      class="hidden-xs-only"
      href="https://beian.miit.gov.cn/#/Integrated/index"
      style="margin-left: 3px; color: var(--el-color-grey)"
      target="_blank"
    >
      {{ beian }}
    </a>
  </footer>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabFooter',
})

const route = useRoute()
const fullYear = new Date().getFullYear()
const settingsStore = useSettingsStore()
const { title, theme } = storeToRefs(settingsStore)
const beian = ref<any>(localStorage.getItem('beian'))

console.log(route.query)

onBeforeMount(() => {
  if (route.query && route.query.beian) {
    beian.value = route.query.beian
    localStorage.setItem('beian', beian.value)
  } else {
    // 应对工信部审查，请自行配置成自己的备案号
    // 以下网站一年内停用
    if (location.hostname === 'vue-admin-beautiful.com') beian.value = ''
    // 以下网站为此后官方站点
    if (location.hostname === 'vuejs-core.cn') beian.value = ''
  }
})
</script>

<style lang="scss" scoped>
.vab-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--el-footer-height);
  padding: 0 var(--el-padding) 0 var(--el-padding);
  margin-top: var(--el-margin);
  color: var(--el-color-grey);
  background: var(--el-color-white);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  transition: var(--el-transition);

  i {
    margin: 0 3px;
  }
}
</style>
