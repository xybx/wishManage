<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
      </div>
    </template>
    <div class="text item">
      <buttonRef
        ref="btnRef"
        :leftBtn="leftBtnObj"
        :rightBtn="rightBtnObj"
        @leftClick="leftClick"
        @rightClick="rightClick"
      />
      <tableRef
        ref="tableRefs"
        v-model:tableData="tableData"
        v-model:tableColumns="tableColumns"
        v-model:tabloading="tabloading"
        v-model:loadingText="loadingText"
        v-model:operateBtn="operateBtn"
        @sortClick="sortChange"
        @selectClick="handleSelectionChange"
        @operateClick="operateClick"
        @formatData="formatStatus"
        v-model:fit="fit"
      />
      <!--
        v-model:defaultExpand="defaultExpand"  -->

      <DeptDialog
        v-model:dialogVisible="dialogVisible"
        @getData="getTableList"
        v-model:dialogList="dialogList"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import buttonRef from "/@/components/global/buttonRef.vue";
import tableRef from "/@/components/global/tableRef.vue";

import type {
  TableColumnProps,
  TableProps,
  ButtonProps,
  JsonProps,
  DialogProps,
} from "/@/types/orgStruct/deviceListTypes.ts";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button.ts";

import { ref, onMounted } from "vue";
import DeptDialog from "./components/orgUserLevelManger/addLevel.vue";
import {
  getUserGradeTreeManagementApi,
  delDeptApi,
} from "/@/api/organizStruct/orgLevelApi.ts";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "DeviceList",
});

const fit = ref(true);
const route = useRoute();
let title: any = route.meta.title;
const btnRef = ref<any>();
const queRef = ref<any>();
const tableRefs = ref<any>();
const tableData = ref<TableProps[] | []>([]);
const tabloading = ref<boolean>(true);
const tableColumns = ref<TableColumnProps[] | []>([]);
const loadingText = ref<string>("");
const total = ref<number>(0);
const pageSize = ref<number>(10);
const pageNum = ref<number>(1);
const leftBtnObj = ref<ButtonProps[] | []>([]);
const rightBtnObj = ref<ButtonProps[] | []>([]);
const operateBtn = ref<ButtonProps[] | []>([]);
const sortColumn = ref<string | null>("pid");
const sortType = ref<string | null>("DESC");
const labelwidth = ref<string>("80px");
const queryList = ref<JsonProps[] | []>([]);
const tableList = ref<JsonProps>({});
let queryForm = reactive<any>({});
const selectedRows = ref<string[]>([]);

const dialogVisible = ref<boolean>(false);
const dialogList = ref<DialogProps>({});
// 创建下拉框对象数组
// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
  leftBtnObj.value = getTopButton([
    { name: "新增", funName: "addClick" },
    // { name: "展开/折叠", funName: "expandClick" },
  ]) as ButtonProps[];
  // rightBtnObj.value = getTopButton([
  //   { name: "搜索", funName: "searchClick" },
  //   { name: "重置", funName: "resetClick" },
  // ]) as ButtonProps[];
};
//添加事件
const addClick = () => {
  dialogList.value.modeType = "add";
  dialogList.value.title = "添加";
  dialogList.value.pid = 0;
  dialogVisible.value = true;
};

const defaultExpand = ref<boolean>(true);
const expandClick = () => {
  defaultExpand.value = !defaultExpand.value;
  console.log(defaultExpand.value);
};

// 获取查询条件接口或json

//格式化表格某些字段的数据
const formatStatus = (obj: any) => {
  return obj == 0 ? "未办理" : "已办理";
};
const getTableColumns = () => {
  tableColumns.value = [
    { prop: "gradename", label: "级别名称", align: "left" },

    { prop: "sortnum", label: "排序" },

    { prop: "value", label: "标识" },

    { prop: "remark", label: "备注" },
  ];
};
const getOperate = () => {
  operateBtn.value = getTopButton([
    { name: "编辑", funName: "editClick" },
    { name: "添加", funName: "rowAddClick" },
    { name: "删除", funName: "delClick" },
  ]) as ButtonProps[];
};

//查询搜索事件
const searchClick = () => {
  getTableList();
};

//重置
const resetClick = () => {
  queryForm = reactive<any>({});
  getTableList();
};

//排序事件
const sortChange = async (column: any) => {
  console.log(column);
  if (column.order != null && column.prop != null) {
    sortColumn.value = column.prop;
    if (column.order == "ascending") {
      sortType.value = "ASC";
    } else if (column.order == "descending") {
      sortType.value = "DESC";
    }
  } else {
    sortType.value = null;
    sortColumn.value = null;
  }
  pageNum.value = 1;
  await getTableList();
};

//列表勾选事件
const handleSelectionChange = (rows: any) => {
  selectedRows.value = rows.map((item: any) => {
    return item.pid;
  });
  console.log(selectedRows.value);
};

//编辑事件
const editClick = (pid: number) => {
  console.log(pid);
  dialogList.value.modeType = "edit";
  dialogList.value.title = "编辑";
  dialogList.value.pid = pid;
  dialogVisible.value = true;
};
//添加事件
const rowAddClick = (pid: number) => {
  console.log(pid);
  dialogList.value.modeType = "add";
  dialogList.value.title = "添加";
  dialogList.value.pid = pid;
  dialogVisible.value = true;
};

//删除事件
const delClick = async (pid: number) => {
  ElMessageBox.confirm("确定要删除该级别吗？", "级别删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let loadingInstance1 = ElLoading.service({ fullscreen: true });
      await delDeptApi({ pid: pid })
        .then((result: any) => {
          if (result.code == 200) {
            loadingInstance1.close();
            ElMessage({
              type: "success",
              message: "删除成功",
            });
            getTableList();
          }
        })
        .catch((err) => {
          loadingInstance1.close();
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};

const map = new Map([
  ["addClick", addClick],
  ["delClick", delClick],
  ["editClick", editClick],
  ["rowAddClick", rowAddClick],
]);

const leftClick = (name: string) => {
  // name是动态的
  if (map.has(name)) {
    const func: any = map.get(name);
    func();
  }
};
const rightClick = (name: string) => {
  // name是动态的
  if (map.has(name)) {
    const func: any = map.get(name);
    func();
  }
};

const operateClick = (name: string, pid: number) => {
  // name是动态的
  if (map.has(name)) {
    const func: any = map.get(name);
    func(pid);
  }
};
// //字符串转函数方法--列表按钮方法
// const operateClick = (name: string, pid: number) => {
//   const func = eval(name);
//   console.log(name, pid);
//   // dialogList.value.parentEleTag = 'el-dialog'

//   func(pid);
// };

//获取列表数据事件
const getTableList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    sortType: sortType.value,
    sortColumn: sortColumn.value,
  };
  let arr = Object.keys(queryForm);
  for (let i in queryForm) {
    if (arr.includes(i)) {
      Object.assign(params, queryForm);
    }
  }
  let res: any = await getUserGradeTreeManagementApi(params);
  if (res.code == 200) {
    tableData.value = res.data;
  } else {
    tableData.value = [];
  }
  setTimeout(() => {
    tabloading.value = false;
  }, 200);
};

//下拉框数据赋值
//生命周期hooks
onMounted(async () => {
  getButton();
  getTableColumns();
  getOperate();
  getTableList();
});
</script>

<style scoped lang="scss">
@use "/@/styles/base/base.scss";
@use "/@/styles/listpage/listpage.scss";
</style>
