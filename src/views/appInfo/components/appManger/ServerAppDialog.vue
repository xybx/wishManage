<template>
  <component :is="dialogList?.parentEleTag" v-bind="dialogList?.parentOptions">
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
      :selection="true"
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

    <!--    <div class="dialog-footer" style="margin:20px 0 0; text-align: center;">-->
    <!--      <el-button size="large" @click="handleClose">取 消</el-button>-->
    <!--    </div>-->
  </component>
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
  DialogProps,
} from "/@/types/gisServer/GisAppDialogTypes";
import {
  getAppNoServerUrlApi,
  putAppServerurl,
  putAllAppServerurl,
  getAppServerUrlApi,
  delAppServerurl,
  delAllAppServerurl,
} from "/@/api/appinfo/ServerAppDialogApi";
import {
  getkindSelectDataApi,
  getmaptypeSelectDataApi,
  getprjtypeSelectDataApi,
} from "/@/api/gisServer/AppgisserverApi";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";

defineOptions({
  name: "ServerAppDialog",
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

const labelwidth = ref<string>("80px");
const queryList = ref<JsonProps[] | []>([]);
const tableList = ref<JsonProps>({});
let queryForm = reactive<any>({});
const selectedRows = ref<string[]>([]);

const dialogVisible = defineModel<boolean>("dialogVisible");
const dialogList = defineModel<DialogProps | any>("dialogList");

// 创建下拉框对象数组
const statusSelectData = ref<any[] | []>([]);
const kindSelectData = ref<any[] | []>([]);
const maptypeSelectData = ref<any[] | []>([]);
const prjtypeSelectData = ref<any[] | []>([]);
const isBaseMapSelectData = ref<any[] | []>([]);
const istiandiSelectData = ref<any[] | []>([]);
let type = ref<string>("");

// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
  leftBtnObj.value = getTopButton(
    type.value == "look"
      ? [
          { name: "保存选择", funName: "saveClick" },
          { name: "全部分配", funName: "allClick" },
        ]
      : [
          { name: "取消选择分配", funName: "saveNoClick" },
          { name: "全部取消分配", funName: "Noallocate" },
        ]
  ) as ButtonProps[];
  rightBtnObj.value = getTopButton([
    { name: "搜索", funName: "searchClick" },
    { name: "重置", color: "#676767", funName: "resetClick" },
    { name: "取消", color: "#adadad", funName: "handleClose" },
  ]) as ButtonProps[];
};
const getTableOptions = () => {};

//格式化表格某些字段的数据
const formatStatus = (obj: any) => {
  return obj == 0 ? "未办理" : "已办理";
};

//列表字段数据获取或json配置
const getTableColumns = () => {
  tableColumns.value = [
    { prop: "name", label: "名称", sortable: false },
    { prop: "remark", label: "描述", sortable: false },
    { prop: "url", label: "服务地址", sortable: false },
    {
      prop: "status",
      label: "状态",
      sortable: false,
      list: statusSelectData.value,
    },
    {
      prop: "kind",
      label: "地图服务类型",
      sortable: false,
      list: kindSelectData.value,
    },
    {
      prop: "maptype",
      label: "地图维度",
      sortable: false,
      list: maptypeSelectData.value,
    },
    {
      prop: "prjtype",
      label: "服务分类",
      sortable: false,
      list: prjtypeSelectData.value,
    },
    { prop: "createdby", label: "创建人", sortable: false },
    { prop: "createdtime", label: "创建时间", sortable: false },
    { prop: "updatedby", label: "更新人", sortable: false },
    { prop: "updatedtime", label: "更新时间", sortable: false },
    { prop: "tileinfo", label: "服务类型", sortable: false },
    {
      prop: "istiandi",
      label: "是否天地图",
      sortable: false,
      list: istiandiSelectData.value,
    },
  ];
};

const getOperate = () => {
  operateBtn.value = getTopButton(
    type.value == "look"
      ? [{ name: "分配服务", color: "#4484E8", funName: "shareClick" }]
      : [{ name: "取消分配", color: "#4484E8", funName: "cancleClick" }]
  ) as ButtonProps[];
};

// 获取查询条件接口或json
const getQueryList = () => {
  queryList.value = [
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "名称:",
      },
      bindVal: "name",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("请输入名称"),
        clearable: true,
        autocomplete: "off",
        type: "text",
      },
    },
  ];
};

watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    type.value = dialogList.value.modeType;
    getDialog();
    await getstatusSelectData();
    await getkindSelectData();
    await getmaptypeSelectData();
    await getprjtypeSelectData();
    await getisBaseMapSelectData();
    await getistiandiSelectData();
    await getQueryList();
    await getButton();
    await getOperate();
    await getTableColumns();
    await getTableList();
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
};

const handleClose = () => {
  dialogList.value = {};
  selectedRows.value = [];
  tableRefs.value.clearRwos();
  type.value = "";
  dialogVisible.value = false;
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
    let params = Object.assign(
      {},
      { pid: dialogList.value.pid, gisPids: selectedRows.value.join(",") }
    );
    let res = (await putAppServerurl(params)) as any;
    console.log(res);
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
const allClick = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "正在全部分配中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    let params = Object.assign({}, { pid: dialogList.value.pid });
    let res = (await putAllAppServerurl(params)) as any;
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
  console.log(1231);
  const loading = ElLoading.service({
    lock: true,
    text: "正在分配中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    let params = Object.assign({}, { pid: dialogList.value.pid, gisPids: pid });
    let res = (await putAppServerurl(params)) as any;
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
    let params = Object.assign(
      {},
      { pid: dialogList.value.pid, gisPids: selectedRows.value.join(",") }
    );
    let res = (await delAppServerurl(params)) as any;
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
    let params = Object.assign({}, { pid: dialogList.value.pid });
    let res = (await delAllAppServerurl(params)) as any;
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
    let params = Object.assign({}, { pid: dialogList.value.pid, gisPids: pid });
    let res = (await delAppServerurl(params)) as any;
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
  ["searchClick", searchClick],
  ["resetClick", resetClick],
  ["saveClick", saveClick],
  ["allClick", allClick],
  ["saveNoClick", saveNoClick],
  ["Noallocate", Noallocate],
  ["handleClose", handleClose],
  // ["shareClick", shareClick],
  // ["cancleClick", cancleClick],
]);

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

const argmap = new Map([
  ["shareClick", shareClick],
  ["cancleClick", cancleClick],
]);

//字符串转函数方法--列表按钮方法
const operateClick = (name: string, pid: number) => {
  if (argmap.has(name)) {
    const func: any = argmap.get(name);
    func(pid);
  }
};

//获取列表数据事件
const getTableList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    pid: dialogList.value.pid,
  };
  let arr = Object.keys(queryForm);
  for (let i in queryForm) {
    if (arr.includes(i)) {
      Object.assign(params, queryForm);
    }
  }
  let res: any =
    type.value == "look"
      ? await getAppNoServerUrlApi(params)
      : await getAppServerUrlApi(params);
  if (res.code == 200) {
    tableData.value = res.data.list;
    total.value = res.data.total;
    selectedRows.value =
      type.value == "view"
        ? res.data.list && res.data.list.length > 0
          ? res.data.list.map((item: any) => {
              return item.pid;
            })
          : []
        : [];
    tableRefs.value.clearRwos();
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
const getstatusSelectData = async () => {
  let tempSelectData = [
    { label: "停用", value: "0" },
    { label: "启用", value: "1" },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  statusSelectData.value = arr;
};
const getkindSelectData = async () => {
  let res: any = await getkindSelectDataApi();
  if (res.code == 200) {
    let tempSelectData = res.data;
    let arr = [];
    for (let i = 0; i < tempSelectData.length; i++) {
      arr.push({
        label: tempSelectData[i].text,
        value: tempSelectData[i].value,
      });
    }
    kindSelectData.value = arr;
  }
};
const getmaptypeSelectData = async () => {
  let res: any = await getmaptypeSelectDataApi();
  if (res.code == 200) {
    let tempSelectData = res.data;
    let arr = [];
    for (let i = 0; i < tempSelectData.length; i++) {
      arr.push({
        label: tempSelectData[i].text,
        value: tempSelectData[i].value,
      });
    }
    maptypeSelectData.value = arr;
  }
};
const getprjtypeSelectData = async () => {
  let res: any = await getprjtypeSelectDataApi();
  if (res.code == 200) {
    let tempSelectData = res.data;
    let arr = [];
    for (let i = 0; i < tempSelectData.length; i++) {
      arr.push({
        label: tempSelectData[i].text,
        value: tempSelectData[i].value,
      });
    }
    prjtypeSelectData.value = arr;
  }
};
const getisBaseMapSelectData = async () => {
  let tempSelectData = [
    { label: "否", value: "false" },
    { label: "是", value: "true" },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  isBaseMapSelectData.value = arr;
};
const getistiandiSelectData = async () => {
  let tempSelectData = [
    { label: "否", value: "0" },
    { label: "是", value: "1" },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  istiandiSelectData.value = arr;
};
</script>

<style scoped lang="scss">
@use "/@/styles/base/base.scss";
@use "/@/styles/listpage/listpage.scss";
</style>
