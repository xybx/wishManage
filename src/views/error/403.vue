<template>
  <error-container :btn="btn" :headline="headline" :info="info" :oops="oops" />
</template>

<script lang="ts" setup>
const oops = ref<string>('抱歉！')
const headline = ref<string>('您没有操作权限。')
const info = ref<string>('当前帐号没有操作权限，请联系管理员。')
const btn = ref<string>('返回首页')
</script>
