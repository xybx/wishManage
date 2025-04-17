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
      <!--      <queryRef-->
      <!--          ref="queRef"-->
      <!--          v-model:queryForm="queryForm"-->
      <!--          :queryData="queryList"-->
      <!--          v-model:labelwidth="labelwidth"-->
      <!--      />-->
      <tableRef
        ref="tableRefs"
        v-model:tableData="tableData"
        v-model:tableColumns="tableColumns"
        v-model:tabloading="tabloading"
        v-model:loadingText="loadingText"
        v-model:operateBtn="operateBtn"
        v-model:tree="tree"
        v-model:align="align"
        @sortClick="sortChange"
        @selectClick="handleSelectionChange"
        @operateClick="operateClick"
        @formatData="formatStatus"
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
import editDialog from "./components/appManger/VuemenuDialog.vue";
import type {
  TableColumnProps,
  TableProps,
  ButtonProps,
  JsonProps,
  DialogProps,
} from "/@/types/appinfo/VuemenuTypes";
import { getMenuListApi, delMenuApi } from "/@/api/appinfo/VuemenuApi";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "MenuActiveList",
});

const route = useRoute();
let title: any = route.meta.title;
const fit = ref<boolean>(true);
const tree = ref<boolean>(true);
const align = ref<string>("left");
const btnRef = ref<any>();
const queRef = ref<any>();
const tableRefs = ref<any>();
const tableData = ref<TableProps[] | []>([]);
const tabloading = ref<boolean>(true);
const tableColumns = ref<TableColumnProps[] | []>([]);
const loadingText = ref<string>("");
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
const statusSelectData = ref<any[] | []>([]);
const rootSelectData = ref<any>([]);
const isSelectData = ref<any>([]);
const breadSelectData = ref<any>([]);

// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
  leftBtnObj.value = getTopButton([
    { name: "添加", funName: "addClick" },
    // { name: "批量删除", funName: "batchDel" },
  ]) as ButtonProps[];
  // rightBtnObj.value = getTopButton([
  //   { name: "搜索", funName: "searchClick" },
  //   { name: "重置", funName: "resetClick" },
  // ]) as ButtonProps[];
};
const getTableOptions = () => {};

// 获取查询条件接口或json
const getQueryList = () => {
  queryList.value = [];
};
//格式化表格某些字段的数据
const formatStatus = (obj: any) => {
  return obj == 0 ? "未办理" : "已办理";
};

//列表字段数据获取或json配置
const getTableColumns = () => {
  tableColumns.value = [
    { prop: "title", label: "菜单名称", align: "left" },
    { prop: "path", label: "路由路径" },
    { prop: "name", label: "路由名称" },
    { prop: "component", label: "组件" },
    { prop: "sort", label: "排序" },
    { prop: "redirect", label: "重定向" },
    { prop: "isroot", label: "是否根组件", list: rootSelectData.value },
    { prop: "icon", label: "图标" },
    { prop: "hidden", label: "是否隐藏", list: isSelectData.value },
    {
      prop: "breadcrumbhidden",
      label: "面包屑导航是否显示",
      list: breadSelectData.value,
    },
  ];
};

const getOperate = () => {
  // tableData.value.map(item=>{
  //   if(item)
  // })
  operateBtn.value = getTopButton([
    { name: "添加", funName: "subClick" },
    { name: "编辑", funName: "editClick" },
    { name: "删除", funName: "delClick" },
  ]) as ButtonProps[];
};

//添加事件
const addClick = () => {
  console.log("add");
  dialogList.value.modeType = "add";
  dialogList.value.title = "添加";
  dialogList.value.pid = 0;
  dialogVisible.value = true;
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
const subClick = (pid: number) => {
  dialogList.value.modeType = "add";
  dialogList.value.title = "添加";
  dialogList.value.pid = pid;
  dialogVisible.value = true;
};

//删除事件
const delClick = async (pid: number) => {
  console.log(pid);
  ElMessageBox.confirm(`确定要删除该信息吗?`).then(
    async () => {
      let res = (await delMenuApi({ pid: pid })) as any;
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

const map = new Map([
  ["addClick", addClick],
  ["editClick", editClick],
  ["subClick", subClick],
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
  let res: any = await getMenuListApi();
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
const getstatusSelectData = async () => {
  let tempSelectData = [
    { label: "停用", value: 0 },
    { label: "启动", value: 1 },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  statusSelectData.value = arr;
};

const getRootSelectData = async () => {
  let tempSelectData = [
    { label: "否", value: false },
    { label: "是", value: true },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  rootSelectData.value = arr;
};

const getIsSelectData = async () => {
  let tempSelectData = [
    { label: "否", value: false },
    { label: "是", value: true },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  isSelectData.value = arr;
};

const getBreadSelectData = async () => {
  let tempSelectData = [
    { label: "不显示", value: true },
    { label: "显示", value: false },
  ];
  let arr: any[] = tempSelectData.map((item: any) => {
    return {
      label: item.label,
      value: item.value,
    };
  });
  breadSelectData.value = arr;
};

//生命周期hooks
onMounted(async () => {
  await getRootSelectData();
  await getIsSelectData();
  await getBreadSelectData();
  await getTableColumns();
  await getTableList();
  await getQueryList();
  await getButton();
  await getOperate();
});
</script>

<style scoped lang="scss">
@use "/@/styles/base/base.scss";
@use "/@/styles/listpage/listpage.scss";
</style>
