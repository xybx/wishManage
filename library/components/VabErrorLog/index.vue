<template>
  <div v-if="errorLogs.length > 0">
    <el-badge type="danger" :value="errorLogs.length" @click="dialogVisible = true">
      <vab-icon icon="bug-line" />
    </el-badge>

    <vab-dialog v-model="dialogVisible" append-to-body title="shop-vite 异常捕获" width="60%">
      <vab-error-log-content />
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="clearAll">暂不显示</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useErrorLogStore } from '/@/store/modules/errorLog'

defineOptions({
  name: 'VabErrorLog',
})

const errorLogStore = useErrorLogStore()
const { errorLogs } = storeToRefs(errorLogStore)
const { clearErrorLog } = errorLogStore
const dialogVisible = ref<boolean>(false)

const clearAll = () => {
  dialogVisible.value = false
  clearErrorLog()
}
</script>
