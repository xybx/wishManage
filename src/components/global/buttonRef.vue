<template>
  <div class="btn-container">
    <div class="btn-left">
      <template v-for="(item,index) in props.leftBtn" :key="index">
          <el-button :color="item.color ? item.color : ''" :size="item.size ? item.size : 'default'" @click="leftClick(item.funName as string)">
           <template v-if="item.icon" #icon>
              <i class="iconfont" :class="item.icon ? item.icon : ''"></i>
           </template>
            {{item.name ? item.name : ''}}
          </el-button>
      </template>
    </div>
    <div class="btn-right">
      <template v-for="(item,index) in props.rightBtn" :key="index">
        <el-button :color="item.color ? item.color : ''" :size="item.size ? item.size : 'default'" @click="rightClick(item.funName as string)">
          <template v-if="item.icon" #icon>
              <i class="iconfont" :class="item.icon ? item.icon : ''"></i>
           </template>
          {{item.name ? item.name : ''}}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type {ButtonProps} from "/@/types/listTypes.ts";
  defineComponent({
      name:'buttonRef'
  })
  const props = defineProps<{leftBtn:ButtonProps[],rightBtn:ButtonProps[]}>()
  const emits = defineEmits(['leftClick','rightClick'])

  const leftClick = (name:string)=>{
    emits('leftClick',name)
  }

  const rightClick = (name:string)=>{
    emits('rightClick',name)
  }


</script>

<style scoped lang="scss">
@use '/@/styles/button/btnref.scss';
</style>
