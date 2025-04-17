<template>
  <error-container :btn="btn" :headline="headline" :info="info" :oops="oops" />
</template>

<script lang="ts" setup>
const oops = ref<string>('抱歉！')
const headline = ref<string>('当前页面不存在。')
const info = ref<string>('请检查您输入的网址是否正确，或点击下面的按钮返回首页。')
const btn = ref<string>('返回首页')
</script>
