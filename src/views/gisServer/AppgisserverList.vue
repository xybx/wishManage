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
        ref="eidtDialog"
        v-model:dialogVisible="dialogVisible"
        @getData="getTableList"
        v-model:dialogList="dialogList"
      />
      <gisApp
        v-model:dialogVisible="gisAppdialogVisible"
        v-model:dialogList="gisAppdialogList"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import buttonRef from "/@/components/global/buttonRef.vue";
import queryRef from "/@/components/global/queryRef.vue";
import tableRef from "/@/components/global/tableRef.vue";
import editDialog from "./components/AppgisserverDialog.vue";
import gisApp from "./components/GisAppDialog.vue";
import type {
  TableColumnProps,
  TableProps,
  ButtonProps,
  JsonProps,
  DialogProps,
} from "/@/types/gisServer/AppgisserverTypes";
import {
  getDataListApi,
  del,
  putMultiDel,
  getkindSelectDataApi,
  getmaptypeSelectDataApi,
  getprjtypeSelectDataApi,
} from "/@/api/gisServer/AppgisserverApi";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "AppgisserverList",
});

const route = useRoute();
let title: any = route.meta.title;
const btnRef = ref<any>();
const queRef = ref<any>();
const tableRefs = ref<any>();
const eidtDialog = ref<any>();

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
const gisAppdialogVisible = ref<boolean>(false);
const gisAppdialogList = ref<DialogProps>({});
// 创建下拉框对象数组
const statusSelectData = ref<any[] | []>([]);
const kindSelectData = ref<any[] | []>([]);
const maptypeSelectData = ref<any[] | []>([]);
const prjtypeSelectData = ref<any[] | []>([]);
const isBaseMapSelectData = ref<any[] | []>([]);
const istiandiSelectData = ref<any[] | []>([]);
// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
  leftBtnObj.value = getTopButton([
    { name: "新增", funName: "addClick" },
    // { name: "批量删除", funName: "batchDel" },
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
        label: "名称:",
      },
      bindVal: "name",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("名称"),
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
        placeholder: translate("状态"),
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
    { prop: "name", label: "名称", sortable: false },
    { prop: "remark", label: "描述", sortable: false },
    { prop: "url", label: "服务地址", sortable: false },
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

    {
      prop: "tileinfo",
      label: "服务类型",
      sortable: false,
    },
    {
      prop: "istiandi",
      label: "是否天地图",
      sortable: false,
      list: istiandiSelectData.value,
    },
    {
      prop: "status",
      label: "状态",
      sortable: false,
      list: statusSelectData.value,
    },

    { prop: "createdby", label: "创建人", sortable: false },

    { prop: "createdtime", label: "创建时间", sortable: false },

    { prop: "updatedby", label: "更新人", sortable: false },

    { prop: "updatedtime", label: "更新时间", sortable: false },
  ];
};

const getOperate = () => {
  operateBtn.value = getTopButton([
    { name: "编辑", funName: "editClick" },
    { name: "分配应用", funName: "shareAppClick" },
    { name: "应用管理", funName: "manageAppClick" },
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

//批量删除
const batchDel = async () => {
  if (selectedRows.value.length == 0) {
    ElMessage({
      type: "error",
      message: "请勾选需要删除的数据！",
    });
    return false;
  }
  let params = { pids: selectedRows.value.join(",") };
  let res: any = await putMultiDel(params);
  if (res.code == 200) {
    ElMessage.success("删除成功");
    getTableList();
  } else {
    ElMessage.error("删除失败");
  }
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
  const func = eval(name);
  func();
};

const rightClick = (name: string) => {
  const func = eval(name);
  console.log(name);
  func();
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

const shareAppClick = (pid: number) => {
  gisAppdialogList.value.modeType = "look";
  gisAppdialogList.value.title = "分配应用";
  gisAppdialogList.value.pid = pid;
  gisAppdialogVisible.value = true;
};

const manageAppClick = (pid: number) => {
  gisAppdialogList.value.modeType = "view";
  gisAppdialogList.value.title = "应用管理";
  gisAppdialogList.value.pid = pid;
  gisAppdialogVisible.value = true;
};

const map = new Map([
  ["addClick", addClick],
  ["searchClick", searchClick],
  ["resetClick", resetClick],
  ["editClick", editClick],
  ["shareAppClick", shareAppClick],
  ["manageAppClick", manageAppClick],
  ["delClick", delClick],
]);

//字符串转函数方法--列表按钮方法
const operateClick = (name: string, pid: number, row: any) => {
  if (map.has(name)) {
    const func: any = map.get(name);
    func(pid);
  }
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
//生命周期hooks
onMounted(async () => {
  await getstatusSelectData();
  await getkindSelectData();
  await getmaptypeSelectData();
  await getprjtypeSelectData();
  await getisBaseMapSelectData();
  await getistiandiSelectData();
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
