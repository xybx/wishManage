<template>
  <el-dialog v-model="dialogVisible" width="80%" title="操作日志" top="8vh" class= "dialogbox">
<!-- <el-card class="box-card"> -->
  <!-- <template #header>
    <div class="card-header">
      <span>{{ title }}</span>
    </div>
  </template> -->
  <div class="text item" style="height: 70vh">
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
      :fit="true"
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

  </div>
<!-- </el-card> -->
</el-dialog>
</template>

<script setup lang="ts">
import buttonRef from "/@/components/global/buttonRef.vue";
import queryRef from "/@/components/global/queryRef.vue";
import tableRef from "/@/components/global/tableRef.vue";
import type {
  TableColumnProps,
  TableProps,
  ButtonProps,
  JsonProps,
} from "/@/types/appinfo/AppoperlogTypes.ts";
import {
  getDataListApi,
} from "/@/api/appinfo/AppoperlogApi.ts";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button.ts";
import { downLoadFile } from "/@/utils/exportExcel";
defineOptions({
name: "ApploginlogList",
});
const dialogVisible = defineModel<boolean>("dialogVisible");
const appname = defineModel("pid");
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
const pageSizes = ref<number[]>([10, 15, 20, 30]);
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
// 创建下拉框对象数组
const statusSelectData = ref<any>([]);
// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
leftBtnObj.value = getTopButton([
  { name: "导出", funName: "getExport" },
]) as ButtonProps[];
rightBtnObj.value = getTopButton([
  { name: "搜索", funName: "searchClick" },
  { name: "重置", funName: "resetClick" },
]) as ButtonProps[];
};

// 获取查询条件接口或json
const getQueryList = () => {
  queryList.value = [
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "操作模块:",
      },
      bindVal: "smodule",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("请输入操作模块"),
        clearable: true,
        autocomplete: "off",
        type: "text",
      },
    },
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "操作ip:",
      },
      bindVal: "ip",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("请输入操作ip"),
        clearable: true,
        autocomplete: "off",
        type: "text",
      },
    },
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "姓名:",
      },
      bindVal: "username",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("请输入姓名"),
        clearable: true,
        autocomplete: "off",
        type: "text",
      },
    },
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "操作时间:",
      },
      bindVal: "lgtime",
      curEleTag: "el-date-picker",
      curOptions: {
        clearable: true,
        type: "datetimerange",
        "range-separator": "至",
        "start-placeholder": "操作开始日期",
        "end-placeholder": "操作结束日期",
        format: "YYYY-MM-DD HH:mm:ss",
        "value-format": "YYYY-MM-DD HH:mm:ss",
      },
    },
  ];
};
//格式化表格某些字段的数据
const formatStatus = (obj: any) => {
return obj == 0 ? "未办理" : "已办理";
};

watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    getTableList();
  }else{
    queryForm =reactive<any>({});
  }
});
//列表字段数据获取或json配置
const getTableColumns = () => {
  tableColumns.value = [

    { prop: "smodule", label: "操作模块" },

    { prop: "saction", label: "操作说明" },

    { prop: "username", label: "姓名" },

    { prop: "url", label: "请求地址" },

    { prop: "rqtype", label: "请求方式" },

    { prop: "ip", label: "操作ip" },

    { prop: "address", label: "操作地点" },

    { prop: "opbgtime", label: "操作时间" },

    { prop: "usedtime", label: "操作用时" },
  ];
};


//导出
const baseUrl = `${window.VITE_APP_BASE_URL}/log-appoperlog/export`;
const getExport = () => {
downLoadFile(baseUrl, queryForm,'startTime','endTime',appname.value);
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
  ["getExport", getExport],
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
};


//字符串转函数方法--列表按钮方法
// const operateClick = (name: string, pid: number) => {
// const func = eval(name);
// console.log(name, pid);

// func(pid);
// };

//获取列表数据事件
const getTableList = async () => {
let params: any = {
  pageNum: pageNum.value,
  pageSize: pageSize.value,
  sortType: sortType.value,
  sortColumn: sortColumn.value,
  appname:appname.value
};
let arr = Object.keys(queryForm);
for (let i in queryForm) {
  if (arr.includes(i)) {
    if (i == "lgtime"&& queryForm[i]) {
      params.startTime = queryForm[i][0];
      params.endTime = queryForm[i][1];
    } else{
      params[i] = queryForm[i]
    }
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

const getstatusSelectData = async () => {
let tempSelectData = [
  { label: "失败", value: "0" },
  { label: "成功", value: "1" },
];
let arr: any[] = tempSelectData.map((item: any) => {
  return {
    label: item.label,
    value: item.value,
  };
});
statusSelectData.value = arr;
};

//生命周期hooks
onMounted(async () => {
await getstatusSelectData();
getQueryList();
getButton();
getTableColumns();
// await getTableList();
});
</script>

<style scoped lang="scss">
@use "/@/styles/base/base.scss";
@use "/@/styles/listpage/listpage.scss";
</style>
