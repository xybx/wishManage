<template>
  <el-table border :data="errorLogs">
    <el-table-column label="报错路由">
      <template #default="{ row }">
        <el-button :href="row.url" rel="noopener noreferrer" tag="a" target="_blank" text type="success">{{ row.url }}</el-button>
      </template>
    </el-table-column>
    <el-table-column label="错误信息">
      <template #default="{ row }">
        <el-tag type="danger">{{ row.err.message }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-tooltip :content="row.err.stack" effect="light">
          <el-button text type="primary">错误详情</el-button>
        </el-tooltip>
        <a>
          <el-button
            v-for="(item, index) in searchList"
            :key="index"
            :href="item.url + row.err.message"
            rel="noopener noreferrer"
            tag="a"
            target="_blank"
            text
            type="primary"
          >
            {{ item.title }}
          </el-button>
        </a>
      </template>
    </el-table-column>
    <template #empty>
      <el-empty class="vab-data-empty" description="暂无数据" />
    </template>
  </el-table>
</template>

<script lang="ts" setup>
import { useErrorLogStore } from '/@/store/modules/errorLog'

defineOptions({
  name: 'VabErrorLogContent',
})

const errorLogStore = useErrorLogStore()
const { errorLogs } = storeToRefs(errorLogStore)

const searchList = ref<any>([
  {
    title: '百度搜索',
    url: 'https://www.baidu.com/baidu?wd=',
    icon: 'baidu-line',
  },
  {
    title: '谷歌搜索',
    url: 'https://www.google.com/search?q=',
    icon: 'google-line',
  },
])
</script>
