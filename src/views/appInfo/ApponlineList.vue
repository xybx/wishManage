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
      <queryRef
        ref="queRef"
        v-model:queryForm="queryForm"
        :queryData="queryList"
        v-model:labelwidth="labelwidth"
      />
      <tableRef
        ref="tableRefs"
        v-model:tableData="tableData"
        v-model:tableColumns="tableColumns"
        v-model:tabloading="tabloading"
        v-model:loadingText="loadingText"
        v-model:operateBtn="operateBtn"
        v-model:appMonitor="appMonitor"
        @sortClick="sortChange"
        @rowClick="rowClick"
        @selectClick="handleSelectionChange"
        @operateClick="operateClick"
        @formatData="formatStatus"
      />
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        background
        layout="total, sizes , prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <OnlinList
        v-model:dialogVisible="onlineDialogVisible"
        v-model:pid="dialogPid"
      />
      <LoginLogList
        v-model:dialogVisible="loginDialogVisible"
        v-model:pid="dialogPid"
      />
      <OperLogList
        v-model:dialogVisible="opeDialogVisible"
        v-model:pid="dialogPid"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import buttonRef from "/@/components/global/buttonRef.vue";
import queryRef from "/@/components/global/queryRef.vue";
import tableRef from "/@/components/global/tableRef.vue";
import OnlinList from "./components/appMonitor/OnlinList.vue";
import LoginLogList from "./components/appMonitor/LoginLogList.vue";
import OperLogList from "./components/appMonitor/OperLogList.vue";
import type {
  TableColumnProps,
  TableProps,
  ButtonProps,
  JsonProps,
  DialogProps,
} from "/@/types/appinfo/ApponlineTypes.ts";
import {
  getDataListApi,
  del,
  putMultiDel,
} from "/@/api/appinfo/ApponlineApi.ts";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button.ts";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "ApponlineList",
});

const route = useRoute();
let title: any = route.meta.title;
const btnRef = ref<any>();
const queRef = ref<any>();
const tableRefs = ref<any>();
const tableData = ref<TableProps[] | []>([]);
const tabloading = ref<boolean>(true);
const appMonitor = ref<boolean>(true)
const tableColumns = ref<TableColumnProps[] | []>([]);
const loadingText = ref<string>("");
const total = ref<number>(0);
const pageSizes = ref<number[]>([10, 15, 20, 30]);
const pageSize = ref<number>(10);
const pageNum = ref<number>(1);
const leftBtnObj = ref<ButtonProps[] | []>([]);
const rightBtnObj = ref<ButtonProps[] | []>([]);
const operateBtn = ref<ButtonProps[] | []>([]);
const sortColumn = ref<string | null>("pid");
const sortType = ref<string | null>("DESC");
const tailRef = ref<any>();
const menuRef = ref<any>();
const labelwidth = ref<string>("80px");
const queryList = ref<JsonProps[] | []>([]);
const tableList = ref<JsonProps>({});
let queryForm = reactive<any>({});
const selectedRows = ref<string[]>([]);

const detailVisible = ref<boolean>(false);
const detailList = ref<DialogProps>({});
// 创建下拉框对象数组
// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
  // leftBtnObj.value = getTopButton([
  //   { name: "新增", funName: "addClick" },
  //   { name: "批量删除", funName: "batchDel" },
  // ]) as ButtonProps[];
  rightBtnObj.value = getTopButton([
    { name: "搜索", funName: "searchClick" },
    { name: "重置", funName: "resetClick" },
  ]) as ButtonProps[];
};
const getTableOptions = () => {};

// 获取查询条件接口或json
const getQueryList = () => {
  queryList.value = [
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "应用名称:",
      },
      bindVal: "appname",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("请输入应用名称"),
        clearable: true,
        autocomplete: "off",
        type: "text",
      },
    },
  ];
};
//格式化表格某些字段的数据
const formatStatus = (obj: any) => {
  return obj == 0 ? "未办理" : "已办理";
};

//列表字段数据获取或json配置
const getTableColumns = () => {
  tableColumns.value = [
    { prop: "appname", label: "应用名称" },

    { prop: "useronline", label: "在线人员" },

    { prop: "appram", label: "应用内存占用" },
    { prop: "totalram", label: "总内存使用" },

    { prop: "totalcpu", label: "当前cpu利用率" },
    { prop: "appcpu", label: "应用占用cpu" },

    { prop: "createtime", label: "启动时间" },

    { prop: "updatetime", label: "更新时间" },
  ];
};

const getOperate = () => {
  operateBtn.value = getTopButton([
    { name: "在线用户", funName: "onlineClick" },
    { name: "登录日志", funName: "loginLogClick" },
    { name: "操作日志", funName: "opeLogClick" },
  ]) as ButtonProps[];
};

const onlineDialogVisible = ref<boolean>(false);
const dialogPid: any = ref();
const onlineClick = (pid:number| string,item: any) => {
  console.log(item.appid);
  dialogPid.value = { pid: item.appid, url:item.actionurl };
  onlineDialogVisible.value = true;
};

const loginDialogVisible = ref<boolean>(false);
const loginLogClick = (pid:number| string,item: any) => {
  dialogPid.value = item.appname;
  loginDialogVisible.value = true;
};

const opeDialogVisible = ref<boolean>(false);
const opeLogClick = (pid:number| string,item: any) => {
  dialogPid.value = item.appname;
  opeDialogVisible.value = true;
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

const map = new Map([
  ["searchClick", searchClick],
  ["resetClick", resetClick],
  ["onlineClick", onlineClick],
  ["loginLogClick", loginLogClick],
  ["opeLogClick", opeLogClick],
]);

const leftClick = (name: string) => {
  // name是动态的
  if (map.has(name)) {
    const func:any = map.get(name);
    func();
  }
};

const rightClick = (name: string) => {
 // name是动态的
 if (map.has(name)) {
    const func:any = map.get(name);
    func();
  }
};
const operateClick = (name: string, pid: number| string,row:any) => {
 // name是动态的
if (map.has(name)) {
   const func:any = map.get(name);
   func(pid,row);
 }

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

//列表行点击事件
const rowClick = (row: any, column: any, event: any) => {};

//列表勾选事件
const handleSelectionChange = (rows: any) => {
  selectedRows.value = rows.map((item: any) => {
    return item.pid;
  });
  console.log(selectedRows.value);
};

// //字符串转函数方法--列表按钮方法
// const operateClick = (name: string, pid: number) => {
//   const func = eval(name);
//   console.log(name, pid);
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
  let res: any = await getDataListApi(params);
  if (res.code == 200) {
    tableData.value = res.data.list;
    total.value = res.data.total;
  } else {
    tableData.value = [];
    total.value = 0;
  }
  setTimeout(() => {
    tabloading.value = false;
  }, 200);
};

//分页条数事件
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getTableList();
};

//页码切换事件
const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getTableList();
};
//下拉框数据赋值
//生命周期hooks
onMounted(async () => {
  getQueryList();
  getButton();
  getTableColumns();
  getOperate();
  await getTableList();
});
</script>

<style scoped lang="scss">
@use "/@/styles/base/base.scss";
@use "/@/styles/listpage/listpage.scss";
</style>
