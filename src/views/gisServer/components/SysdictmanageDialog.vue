<template>
  <component :is="dialogList?.parentEleTag" v-bind="dialogList?.parentOptions">
    <queryRef
      ref="queRef"
      v-model:queryForm="queryForm"
      :queryData="queryList"
      v-model:labelwidth="labelwidth"
    />
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
      v-model:dialogVisible="innerdialogVisible"
      @getData="getTableList"
      v-model:dialogList="innerdialogList"
    />
  </component>
</template>

<script setup lang="ts">
import buttonRef from "/@/components/global/buttonRef.vue";
import queryRef from "/@/components/global/queryRef.vue";
import tableRef from "/@/components/global/tableRef.vue";
import editDialog from "./SysdictionaryDialog.vue";
import type {
  TableColumnProps,
  TableProps,
  ButtonProps,
  JsonProps,
  DialogProps,
} from "/@/types/gisServer/SysdictionaryTypes.ts";
import {
  getDataListApi,
  del,
  putMultiDel,
} from "/@/api/gisServer/SysdictionaryApi.ts";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button.ts";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "SysdictmanageDialog",
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
const innerdialogVisible = ref<boolean>(false);
const innerdialogList = ref<DialogProps>({});
// const detailVisible = ref<boolean>(false);
// const detailList = ref<DialogProps>({});
let type = ref<string>('')
// 创建下拉框对象数组
const statusSelectData = ref<any>([]);
// 创建下拉框对象数组
// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
  leftBtnObj.value = getTopButton([
    { name: "添加", funName: "addClick" },
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
        label: "键名称:",
      },
      bindVal: "skey",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("键名称"),
        clearable: true,
        autocomplete: "off",
        type: "text",
      },
    },
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "值:",
      },
      bindVal: "svalue",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("值"),
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
    { prop: "systable", label: "归属表", sortable: false },

    { prop: "skey", label: "键名称", sortable: false },

    { prop: "svalue", label: "键值", sortable: false },

    { prop: "status", label: "状态", sortable: false, list: statusSelectData.value },

    { prop: "remark", label: "说明", sortable: false },

    { prop: "norder", label: "排序", sortable: false },
  ];
};

const getOperate = () => {
  operateBtn.value = getTopButton([
    { name: "编辑", funName: "editClick" },
    { name: "删除", funName: "delClick" },
  ]) as ButtonProps[];
};

//下拉框数据赋值
const getstatusSelectData = async () => {
  let tempSelectData = [
    { label: "停用", value: 0 },
    { label: "正常", value: 1 },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  statusSelectData.value = arr;
};

//添加事件
const addClick = () => {
  innerdialogList.value.modeType = "add";
  innerdialogList.value.title = "新增";
  innerdialogList.value.subData = dialogList.value.subData
  innerdialogVisible.value = true;
};

watch(dialogVisible,async (newValue,b)=>{
  if(newValue){
    getDialog()
    type.value = dialogList.value.modeType;
    await getstatusSelectData();
    await getQueryList();
    await getButton();
    await getTableColumns();
    await getOperate();
    await getTableList();
  }
})

const getDialog = () => {
  // 标签名
  dialogList.value.parentEleTag = "el-dialog";
  // 属性
  dialogList.value.parentOptions = {
    modelValue: dialogVisible,
    title: dialogList.value?.title,
    width: "76%",
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

const handleClose = ()=>{
  dialogList.value.title = ''
  resetClick()
  dialogVisible.value = false
}

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
  if(map.has(name)){
    const func:any = map.get(name);
    func();
  }
};

const rightClick = (name: string) => {
  if(map.has(name)){
    const func:any = map.get(name);
    func();
  }
};

//排序事件
const sortChange = async (column: any) => {
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
  innerdialogList.value.modeType = "edit";
  innerdialogList.value.title = "编辑";
  innerdialogList.value.pid = pid;
  innerdialogVisible.value = true;
};

//删除事件
const delClick = async (pid: number) => {
  ElMessageBox.confirm(`确定要删除该信息吗?`).then(
    async () => {
      let res = (await del({ pid: pid })) as any;
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

const map = new Map([
  ["addClick", addClick],
  ["searchClick", searchClick],
  ["resetClick", resetClick],
  ["editClick", editClick],
  ["delClick", delClick],
])

//字符串转函数方法--列表按钮方法
const operateClick = (name: string, pid: number,row:any) => {
  if(map.has(name)){
    const func:any = map.get(name);
    func(pid);
  }
};

//获取列表数据事件
const getTableList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    systable:dialogList.value.subData,
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

</script>

<style scoped lang="scss">
@use "/@/styles/base/base.scss";
@use "/@/styles/listpage/listpage.scss";
</style>
