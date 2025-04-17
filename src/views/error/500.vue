<template>
  <error-container :btn="btn" :headline="headline" :info="info" :oops="oops" />
</template>

<script lang="ts" setup>
const oops = ref<string>('抱歉！')
const headline = ref<string>('服务器发生错误。')
const info = ref<string>('请稍后重试，或点击下面的按钮返回首页。')
const btn = ref<string>('返回首页')
</script>
