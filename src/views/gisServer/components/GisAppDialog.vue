<template>
  <component :is="dialogList?.parentEleTag" v-bind="dialogList?.parentOptions">
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
      :selection="true"
      @sortClick="sortChange"
      @rowClick="rowClick"
      @selectClick="handleSelectionChange"
      @operateClick="operateClick"
      @formatData="formatStatus"
    />
    <div class="dialog-footer" style="margin: 20px 0 0; text-align: center">
      <el-button size="large" @click="handleClose">取 消</el-button>
    </div>
  </component>
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
} from "/@/types/gisServer/GisAppDialogTypes.ts";
import {
  getAppNoGisUrlApi,
  putAppGisurl,
  putAllAppGisurl,
  getAppGisUrlApi,
  delAppGisurl,
  delAllAppGisurl,
} from "/@/api/gisServer/GisAppDialogApi";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";

defineOptions({
  name: "GisAppDialog",
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

const dialogVisible = defineModel<boolean>("dialogVisible");
const dialogList = defineModel<DialogProps | any>("dialogList");
// const detailVisible = ref<boolean>(false);
// const detailList = ref<DialogProps>({});
// 创建下拉框对象数组
const statusSelectData = ref<any[] | []>([]);
let type = ref<string>("");

// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
  leftBtnObj.value = getTopButton(
    type.value == "look"
      ? [
          { name: "保存选择", funName: "saveClick" },
          { name: "全部分配", funName: "allocate" },
        ]
      : [
          { name: "取消选择分配", funName: "saveNoClick" },
          { name: "全部取消分配", funName: "Noallocate" },
        ]
  ) as ButtonProps[];
};
const getTableOptions = () => {};

//格式化表格某些字段的数据
const formatStatus = (obj: any) => {
  return obj == 0 ? "未办理" : "已办理";
};

//列表字段数据获取或json配置
const getTableColumns = () => {
  tableColumns.value = [
    { prop: "sname", label: "名称", sortable: true },

    { prop: "describe", label: "描述", sortable: true },

    { prop: "actionurl", label: "监控地址", sortable: true },

    {
      prop: "status",
      label: "状态",
      sortable: true,
      list: statusSelectData.value,
    },

    // {prop: 'createuserpid', label: '创建人',sortable:true},

    { prop: "createtime", label: "创建时间", sortable: true },

    { prop: "updatetime", label: "更新日期", sortable: true },
  ];
};

const getOperate = () => {
  let arr =
    type.value == "look"
      ? [{ name: "分配应用", color: "#4484E8", funName: "shareClick" }]
      : [{ name: "取消分配", color: "#4484E8", funName: "cancleClick" }];
  operateBtn.value = getTopButton(arr) as ButtonProps[];
};

watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    type.value = dialogList.value.modeType;
    getDialog();
    await getstatusSelectData();
    await getButton();
    await getTableColumns();
    await getTableList();
    await getOperate();
  }
});

const getDialog = () => {
  // 标签名
  dialogList.value.parentEleTag = "el-dialog";
  // 属性
  dialogList.value.parentOptions = {
    modelValue: dialogVisible,
    title: dialogList.value?.title,
    width: "78%",
    class: "dialogbox",
    "close-on-click-modal": false,
    appendToBody: true,
    "align-Center": true,
    center: true,
    "before-close": handleClose,
  };
  // 方法
  // dialogList.value.parentEvent = {};
};

const handleClose = () => {
  dialogList.value = {};
  selectedRows.value = [];
  tableRefs.value.clearRwos();
  type.value = "";
  dialogVisible.value = false;
};

const leftClick = (name: string) => {
  if (map.has(name) || argsmap.has(name)) {
    const func: any = map.get(name) || argsmap.get(name);
    func();
  }
};

const rightClick = (name: string) => {
  if (map.has(name) || argsmap.has(name)) {
    const func: any = map.get(name) || argsmap.get(name);
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

//保存选择
const saveClick = async () => {
  if (selectedRows.value.length == 0) {
    ElMessage({
      type: "error",
      message: "请勾选需要保存选择的数据！",
    });
    return false;
  }
  const loading = ElLoading.service({
    lock: true,
    text: "正在保存",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    let data = Object.assign(
      {},
      { gisPid: dialogList.value.pid, appPids: selectedRows.value.join(",") }
    );
    let res: any = await putAppGisurl(data);
    if (res.code == 200) {
      loading.close();
      ElMessage({ type: "success", message: res.msg });
      getTableList();
    }
  } catch (e) {
    loading.close();
  }
};

//全部选择
const allocate = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "正在全部分配中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    let data = Object.assign({}, { gisPid: dialogList.value.pid });
    let res: any = await putAllAppGisurl(data);
    if (res.code == 200) {
      loading.close();
      ElMessage({ type: "success", message: res.msg });
      getTableList();
    }
  } catch (e) {
    loading.close();
  }
};

//单个分配
const shareClick = async (pid: number) => {
  const loading = ElLoading.service({
    lock: true,
    text: "正在分配中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    let data = Object.assign(
      {},
      { gisPid: dialogList.value.pid, appPids: pid }
    );
    let res: any = await putAppGisurl(data);
    if (res.code == 200) {
      loading.close();
      ElMessage({ type: "success", message: res.msg });
      getTableList();
    }
  } catch (e) {
    loading.close();
  }
};

const saveNoClick = async () => {
  if (selectedRows.value.length == 0) {
    ElMessage({
      type: "error",
      message: "请勾选需要取消选择的数据！",
    });
    return false;
  }
  const loading = ElLoading.service({
    lock: true,
    text: "正在取消",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    let data = Object.assign(
      {},
      { gisPid: dialogList.value.pid, appPids: selectedRows.value.join(",") }
    );
    let res: any = await delAppGisurl(data);
    if (res.code == 200) {
      loading.close();
      ElMessage({ type: "success", message: res.msg });
      getTableList();
    }
  } catch (e) {
    loading.close();
  }
};

const Noallocate = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "正在全部取消中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    let data = Object.assign({}, { gisPid: dialogList.value.pid });
    let res: any = await delAllAppGisurl(data);
    if (res.code == 200) {
      loading.close();
      ElMessage({ type: "success", message: res.msg });
      getTableList();
    }
  } catch (e) {
    loading.close();
  }
};

const cancleClick = async (pid: number) => {
  const loading = ElLoading.service({
    lock: true,
    text: "正在取消",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    let data = Object.assign(
      {},
      { gisPid: dialogList.value.pid, appPids: pid }
    );
    let res: any = await delAppGisurl(data);
    if (res.code == 200) {
      loading.close();
      ElMessage({ type: "success", message: res.msg });
      getTableList();
    }
  } catch (e) {
    loading.close();
  }
};

const map = new Map([
  ["saveClick", saveClick],
  ["saveNoClick", saveNoClick],
]);

const argsmap = new Map([
  ["allocate", allocate],
  ["Noallocate", Noallocate],
  ["shareClick", shareClick],
  ["cancleClick", cancleClick],
]);

//字符串转函数方法--列表按钮方法
const operateClick = (name: string, pid: number, row: any) => {
  if (argsmap.has(name)) {
    const func: any = argsmap.get(name);
    func(pid);
  }
};

//获取列表数据事件
const getTableList = async () => {
  let params = { gispid: dialogList.value.pid };
  let arr = Object.keys(queryForm);
  for (let i in queryForm) {
    if (arr.includes(i)) {
      Object.assign(params, queryForm);
    }
  }
  let res: any =
    type.value == "look"
      ? await getAppNoGisUrlApi(params)
      : await getAppGisUrlApi(params);
  if (res.code == 200) {
    tableData.value = res.data;
    selectedRows.value =
      type.value == "view"
        ? res.data.map((item: any) => {
            return item.appid;
          })
        : [];

    tableRefs.value.clearRwos();
  } else {
    tableData.value = [];
  }
  setTimeout(() => {
    tabloading.value = false;
  }, 200);
};

//下拉框数据赋值
const getstatusSelectData = async () => {
  let tempSelectData = [
    { label: "停用", value: "0" },
    { label: "正常", value: "1" },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  statusSelectData.value = arr;
};
</script>

<style scoped lang="scss">
@use "/@/styles/base/base.scss";
@use "/@/styles/listpage/listpage.scss";
</style>
