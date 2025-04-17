<template>
  <el-pagination
    :background="background"
    :current-page="currentPage"
    :default-current-page="defaultCurrentPage"
    :default-page-size="defaultPageSize"
    :disabled="disabled"
    :hide-on-single-page="hideOnSinglePage"
    :layout="layout"
    :next-icon="nextIcon"
    :next-text="nextText"
    :page-count="pageCount"
    :page-size="pageSize"
    :page-sizes="pageSizes"
    :pager-count="pagerCount"
    :popper-class="popperClass"
    :prev-icon="prevIcon"
    :prev-text="prevText"
    :small="small"
    :teleported="teleported"
    :total="total"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
import { ElPagination } from 'element-plus'

defineOptions({
  name: 'VabPagination',
})

defineProps({
  ...ElPagination.props,
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  background: {
    type: Boolean,
    default: true,
  },
})
</script>
