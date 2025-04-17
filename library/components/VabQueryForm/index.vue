<template>
  <el-row class="vab-query-form" :gutter="0">
    <slot></slot>
  </el-row>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabQueryForm',
})
</script>

<style lang="scss" scoped>
@mixin panel {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  min-height: var(-el-input-height);
  margin: 0 0 calc(var(--el-margin) / 2) 0;
  .el-form-item__content {
    display: flex;
    align-items: center;
  }

  > .el-button {
    margin: 0 10px calc(var(--el-margin) / 2) 0 !important;
  }
}

.vab-query-form {
  :deep() {
    .el-input {
      width: 175px;
    }

    .el-form-item:first-child {
      margin: 0 0 calc(var(--el-margin) / 2) 0 !important;
    }

    .el-form-item + .el-form-item {
      margin: 0 0 calc(var(--el-margin) / 2) 0 !important;

      .el-button {
        margin: 0 0 0 10px !important;
      }
    }

    .top-panel {
      @include panel;
    }

    .bottom-panel {
      @include panel;
      border-top: 1px solid #dcdfe6;
    }

    .left-panel {
      @include panel;
    }

    .right-panel {
      @include panel;
      justify-content: flex-end;
    }
  }
}
</style>
