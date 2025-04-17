<template>
  <error-container :btn="btn" :headline="headline" :info="info" :oops="oops" />
</template>

<script lang="ts" setup>
const oops = ref<string>('抱歉！')
const headline = ref<string>('服务不可用。')
const info = ref<string>('服务器当前无法处理请求，可能是由于过载或正在进行维护。')
const btn = ref<string>('返回首页')
</script>
