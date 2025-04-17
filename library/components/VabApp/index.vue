<template>
  <el-config-provider :button="{ autoInsertSpace: true }" :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { enLocale, zhLocale } from '/@/i18n'

defineOptions({
  name: 'VabApp',
})

const { locale: language } = useI18n()
const locale = computed(() => (language.value === 'en' ? enLocale : zhLocale))
</script>
