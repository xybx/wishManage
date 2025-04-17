<template>
  <el-table
    ref="tableRef"
    class="tableref"
    :data="tableData"
    row-key="pid"
    border
    stripe
    tooltip-effect="light"
    :tooltip-options="{ placement: 'bottom' }"
    :default-sort="{ prop: 'pid', order: 'descending' }"
    v-loading="tabloading"
    :element-loading-text="loadingText"
    @sort-change="sortChange"
    @row-click="rowClick"
    @selection-change="handleSelectionChange"
    default-expand-all
  >
    <!--
:default-expand-all="defaultExpand"
:key="treeKey"
   -->
    <el-table-column
      type="selection"
      align="center"
      width="60px"
      v-if="selection"
    ></el-table-column>
    <template v-for="item in tableColumns" :key="item.prop">
      <el-table-column
        :align="item.align ? item.align : 'center'"
        :sortable="item.sortable != false"
        show-overflow-tooltip
        :prop="item.prop"
        :label="item.label"
        :width="fit ? '' : '200'"
      >
        <!-- <template v-if="item.prop == 'status'" #default="{ row, $index }">
          {{ row[item.prop] }}
        </template> -->
        <template v-if="item.list" #default="{ row, $index }">
          {{
            String(row[item.prop])
              ? item.list.filter((val: any) => val.value == row[item.prop])
                  .length > 0
                ? item.list.filter((val: any) => val.value == row[item.prop])[0]
                    .label
                : "暂未找到该条数据，或已删除"
              : "暂无数据"
          }}
        </template>
        <template #default="{ row, $index }">
          {{
            row[item.prop] || row[item.prop] == 0 ? row[item.prop] : "暂无数据"
          }}
        </template>
      </el-table-column>
    </template>
    <el-table-column
      fixed="right"
      label="操作"
      :align="align ? align : 'center'"
      :width="operateBtnWidth ? operateBtnWidth : 300"
      v-if="operateBtn&&operateBtn.length > 0"
    >
      <template #default="{ row, $index }" v-if="appMonitor">
        <el-button
          v-for="item in operateBtn"
          :color="item.color ? item.color : ''"
          :size="item.size ? item.size : 'default'"
          @click="operateClick(item.funName as string, row.pid, row)"
          style="margin-bottom: 5px"
        >
          <template v-if="item.icon" #icon>
            <i class="iconfont" :class="item.icon ? item.icon : ''"></i>
          </template>
          {{ item.name ? item.name : "" }}
        </el-button>
      </template>
      <template #default="{ row, $index }" v-else-if="tree">
        <template v-for="(item, index) in operateBtn" :key="index">
          <template v-if="item.funName == 'subClick'">
            <el-button
              v-if="row.parentpid == '0'"
              :color="item.color ? item.color : ''"
              :size="item.size ? item.size : 'default'"
              @click="operateClick(item.funName as string, row.pid, row)"
              style="margin-bottom: 5px"
            >
              <template v-if="item.icon" #icon>
                <i class="iconfont" :class="item.icon ? item.icon : ''"></i>
              </template>
              {{ item.name ? item.name : "" }}
            </el-button>
          </template>
          <template v-else>
            <el-button
              :color="item.color ? item.color : ''"
              :size="item.size ? item.size : 'default'"
              @click="operateClick(item.funName as string, row.pid, row)"
              style="margin-bottom: 5px"
            >
              <template v-if="item.icon" #icon>
                <i class="iconfont" :class="item.icon ? item.icon : ''"></i>
              </template>
              {{ item.name ? item.name : "" }}
            </el-button>
          </template>
        </template>
      </template>
      <template #default="{ row, $index }" v-else>
        <template v-if="operateBtn.length > 3">
          <el-button
            v-for="item in baseBtn"
            :color="item.color ? item.color : ''"
            :size="item.size ? item.size : 'default'"
            @click="operateClick(item.funName as string, row.pid, row)"
            style="margin-bottom: 5px"
          >
            <template v-if="item.icon" #icon>
              <i class="iconfont" :class="item.icon ? item.icon : ''"></i>
            </template>
            {{ item.name ? item.name : "" }}
          </el-button>
          <el-popover
            placement="top-start"
            :width="160"
            trigger="hover"
            popper-style="text-align: center;"
          >
            <template #reference>
              <el-button class="m-2">更多···</el-button>
            </template>
            <template #default>
              <el-button
                v-for="item in otherBtn"
                :color="item.color ? item.color : ''"
                :size="item.size ? item.size : 'default'"
                @click="operateClick(item.funName as string, row.pid, row)"
                style="margin: unset; margin-bottom: 5px"
              >
                <template v-if="item.icon" #icon>
                  <i class="iconfont" :class="item.icon ? item.icon : ''"></i>
                </template>
                {{ item.name ? item.name : "" }}
              </el-button>
            </template>
          </el-popover>
        </template>
        <template v-else>
          <el-button
            v-for="item in operateBtn"
            :color="item.color ? item.color : ''"
            :size="item.size ? item.size : 'default'"
            @click="operateClick(item.funName as string, row.pid, row)"
            style="margin-bottom: 5px"
          >
            <template v-if="item.icon" #icon>
              <i class="iconfont" :class="item.icon ? item.icon : ''"></i>
            </template>
            {{ item.name ? item.name : "" }}
          </el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import type {
  ButtonProps,
  TableColumnProps,
  TableProps,
} from "/@/types/listTypes";
import { ElTable } from "element-plus";

defineComponent({
  name: "tableRef",
});
const tableData = defineModel<TableProps[]>("tableData");
const tableColumns = defineModel<TableColumnProps[]>("tableColumns");
const tabloading = defineModel<any>("tabloading");
const loadingText = defineModel<string>("loadingText");
const operateBtn: any = defineModel<ButtonProps[]>("operateBtn");
const tableRef = ref<InstanceType<typeof ElTable>>();

let baseBtn = ref<ButtonProps[]>([]);
let otherBtn = ref<ButtonProps[]>([]);
watch(
  () => operateBtn.value,
  (newvalue, oldvalue) => {
    if (operateBtn.value.length >= 3) {
      baseBtn.value = operateBtn.value.slice(0, 2);
      otherBtn.value = operateBtn.value.slice(2, operateBtn.value.length);
    }
  }
);

const tableList = defineModel<any>("tableList");
const operateBtnWidth: any = defineModel("operateBtnWidth");
// const selection: any = defineModel("selection");
const appMonitor = defineModel<boolean>("appMonitor");
const selection: any = defineModel("selection");

// const treeKey = ref();
// const defaultExpand = defineModel<boolean>("defaultExpand");
// watch(
//   () => defaultExpand.value,
//   (newvalue, oldvalue) => {
//     console.log(newvalue, oldvalue);
//     treeKey.value = +new Date();
//     defaultExpand.value = newvalue;
//   }
// );
const fit = defineModel<boolean>("fit");
const tree = defineModel<boolean>("tree");
const align = defineModel<string>("align");
const emits = defineEmits([
  "sortClick",
  "rowClick",
  "selectClick",
  "operateClick",
  "formatData",
]);

const toggleRow = (rows: any, strs: any) => {
  if (rows && rows.length > 0) {
    rows.map((item: any) => {
      nextTick(() => {
        tableRef.value!.toggleRowSelection(item, strs);
      });
    });
  }
};

const clearRwos = () => {
  tableRef.value?.clearSelection();
};

const getRows = () => {
  tableRef.value?.getSelectionRows();
};

defineExpose({
  toggleRow,
  getRows,
  clearRwos,
});

const formatData = (obj: any) => {
  emits("formatData", obj);
};

const sortChange = (column: any) => {
  emits("sortClick", column);
};

const rowClick = (row: any, column: any, event: any) => {
  emits("rowClick", row, column, event);
};

const handleSelectionChange = (rows: any) => {
  emits("selectClick", rows);
};

const operateClick = (name: string, pid: any, row: any) => {
  emits("operateClick", name, pid, row);
};
</script>
<style scoped lang="scss">
@use "/@/styles/table/table.scss";
</style>
