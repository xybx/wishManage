<template>
  <ul class="menulist">
    <li v-for="(item,index) in menuData" :key="index" :class="{'active':activeName == item.name}" @click="handleSelect(item.name as number)">{{item.label}}</li>
  </ul>
</template>

<script setup lang="ts">
  import {OptionProps} from "/@/types/loginTypes.ts";
  defineComponent({
      name:'menuNav'
  })
  const menuData = ref<OptionProps[]|[]>([])
  const activeName = ref<number>()
  const emits = defineEmits(['tabClick'])

  const handleSelect = (index:number)=>{
     activeName.value = index
     emits('tabClick',index)
  }
  const getMenu = ()=>{
    menuData.value = [
      {label:'全部',name:1},
      {label:'待办项目',name:2},
      {label:'已办项目',name:3}
    ]
    activeName.value = 1
  }

  onMounted(()=>{
    getMenu()
  })


</script>

<style scoped lang="scss">
@use '/@/styles/menu/menu.scss';
</style>
