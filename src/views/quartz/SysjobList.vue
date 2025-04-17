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
      <editDialog
        v-model:dialogVisible="dialogVisible"
        @getData="getTableList"
        v-model:dialogList="dialogList"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import buttonRef from "/@/components/global/buttonRef.vue";
import queryRef from "/@/components/global/queryRef.vue";
import tableRef from "/@/components/global/tableRef.vue";
import editDialog from "./components/SysjobDialog.vue";
import type {
  TableColumnProps,
  TableProps,
  ButtonProps,
  JsonProps,
  DialogProps,
} from "/@/types/quartz/SysjobTypes.ts";
import { getDataListApi, del, run } from "/@/api/quartz/SysjobApi.ts";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button.ts";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "SysjobList",
});

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
const tailRef = ref<any>();
const menuRef = ref<any>();
const labelwidth = ref<string>("80px");
const queryList = ref<JsonProps[] | []>([]);
const tableList = ref<JsonProps>({});
let queryForm = reactive<any>({});
const selectedRows = ref<string[]>([]);

const dialogVisible = ref<boolean>(false);
const dialogList = ref<DialogProps>({});
const detailVisible = ref<boolean>(false);
const detailList = ref<DialogProps>({});
// 创建下拉框对象数组
const concurrentSelectData = ref<any[] | []>([]);
const misfirepolicySelectData = ref<any[] | []>([]);
const statusSelectData = ref<any[] | []>([]);
const logtypeSelectData = ref<any[] | []>([])
// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
  leftBtnObj.value = getTopButton([
    { name: "新增", funName: "addClick" },
  ]) as ButtonProps[];
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
        label: "任务组名:",
      },
      bindVal: "jobgroup",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("任务组名"),
        clearable: true,
        autocomplete: "off",
        type: "text",
      },
    },
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "任务名称:",
      },
      bindVal: "jobname",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("任务名称"),
        clearable: true,
        autocomplete: "off",
        type: "text",
      },
    },
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "状态:",
      },
      bindVal: "status",
      curEleTag: "el-select",
      childEleTag: "el-option",
      curOptions: {
        placeholder: translate("请选择状态"),
        clearable: true,
      },
      childOptions: statusSelectData.value,
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
    { prop: "jobgroup", label: "任务组名", sortable: false },

    { prop: "jobname", label: "任务名称", sortable: false },

    { prop: "cronexpression", label: "cron执行表达式", sortable: false },

    { prop: "invoketarget", label: "调用目标字符串", sortable: false },

    {
      prop: "concurrent",
      label: "是否并发执行",
      sortable: false,
      list: concurrentSelectData.value,
    },

    {
      prop: "misfirepolicy",
      label: "计划执行错误策略",
      sortable: false,
      list: misfirepolicySelectData.value,
    },
    {
      prop: "logtype",
      label: "日志记录类型",
      sortable: false,
      list: logtypeSelectData.value,
    },
    {
      prop: "status",
      label: "状态",
      sortable: false,
      list: statusSelectData.value,
    },
  ];
};

const getOperate = () => {
  operateBtn.value = getTopButton([
    { name: "编辑", funName: "editClick" },
    { name: "执行一次", funName: "runClick" },
    // { name: "查看", funName: "lookClick" },
    { name: "删除", funName: "delClick" },
  ]) as ButtonProps[];
};

//添加事件
const addClick = () => {
  console.log("add");
  dialogList.value.modeType = "add";
  dialogList.value.title = "新增";
  dialogVisible.value = true;
};

//获取模板
const getTemplate = () => {};

//导入
const getImport = () => {};

//导出
const getExport = () => {};

//查询搜索事件
const searchClick = () => {
  getTableList();
};

//重置
const resetClick = () => {
  queryForm = reactive<any>({});
  getTableList();
};

const leftClick = (name: string) => {
  if (map.has(name)) {
    const func: any = map.get(name);
    func();
  }
};

const rightClick = (name: string) => {
  if (map.has(name)) {
    const func: any = map.get(name);
    func();
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

//编辑事件
const editClick = (pid: number) => {
  console.log(pid);
  dialogList.value.modeType = "edit";
  dialogList.value.title = "编辑";
  dialogList.value.pid = pid;
  dialogVisible.value = true;
};

//查看事件
const lookClick = (pid: number) => {
  detailList.value.modeType = "look";
  detailList.value.title = "查看";
  detailList.value.pid = pid;
  detailVisible.value = true;
};

//删除事件
const delClick = async (pid: number) => {
  console.log(pid);
  ElMessageBox.confirm(`确定要删除该信息吗?`).then(
    async () => {
      let res = (await del({ pid: pid })) as any;
      console.log(res);
      if (res.code == 200) {
        ElMessage.success("删除成功");
        getTableList();
      } else {
        ElMessage.error(res.msg);
      }
    },
    () => {
      ElMessage("取消删除");
    }
  );
};
//执行一次
const runClick = async (pid: number) => {
  let res = (await run({ pid: pid })) as any;
  if (res.code == 200) {
    ElMessage.success("执行成功");
    getTableList();
  } else {
    ElMessage.error(res.msg);
  }
};

const map = new Map([
  ["addClick", addClick],
  ["searchClick", searchClick],
  ["resetClick", resetClick],
  ["editClick", editClick],
  ["runClick", runClick],
  ["delClick", delClick],
]);

//字符串转函数方法--列表按钮方法
const operateClick = (name: string, pid: number) => {
  const func = eval(name);
  console.log(name, pid);
  // dialogList.value.parentEleTag = 'el-dialog'

  func(pid);
};

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
const getconcurrentSelectData = async () => {
  let tempSelectData = [
    { label: "允许", value: "0" },
    { label: "禁止", value: "1" },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  concurrentSelectData.value = arr;
};
const getmisfirepolicySelectData = async () => {
  let tempSelectData = [
    { label: "默认", value: "0" },
    { label: "立即执行", value: "1" },
    { label: "执行一次", value: "2" },
    { label: "放弃执行", value: "3" },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  misfirepolicySelectData.value = arr;
};
const getstatusSelectData = async () => {
  let tempSelectData = [
    { label: "停用", value: "1" },
    { label: "启动", value: "0" },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  statusSelectData.value = arr;
};

const getlogtypeSelectData = async () => {
  let tempSelectData = [
    {label:'不记录',value:0},
    {label:'错误日志',value:1},
    {label:'所有日志',value:2},
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  logtypeSelectData.value = arr;
};


//生命周期hooks
onMounted(async () => {
  await getconcurrentSelectData();
  await getmisfirepolicySelectData();
  await getlogtypeSelectData()
  await getstatusSelectData();
  await getQueryList();
  await getButton();
  await getTableColumns();
  await getOperate();
  await getTableList();
});
</script>

<style scoped lang="scss">
@use "/@/styles/base/base.scss";
@use "/@/styles/listpage/listpage.scss";
</style>
