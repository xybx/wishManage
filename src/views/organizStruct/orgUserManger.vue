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
      <UserDialog
        v-model:dialogVisible="userDialogVisible"
        @getData="getTableList"
        v-model:dialogList="userDialogList"
      />
      <resetPassword
        v-model:dialogVisible="dialogVisibleRe"
        v-model:pid="rePid"
      />
      <DeviceChecked
        v-model:dialogVisible="deviceDialog"
        v-model:pid="devicePid"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import buttonRef from "/@/components/global/buttonRef.vue";
import queryRef from "/@/components/global/queryRef.vue";
import tableRef from "/@/components/global/tableRef.vue";

import UserDialog from "./components/orgUserManger/UserDialog.vue";
import resetPassword from "./components/orgStructManger/resetPassword.vue";
import DeviceChecked from "./components/device/DeviceChecked.vue";
import type {
  TableColumnProps,
  TableProps,
  ButtonProps,
  JsonProps,
  DialogProps,
} from "/@/types/appinfo/AppAssignTypes.ts";
import { getDeptUserList } from "/@/api/organizStruct/orgUserMangerApi.ts";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button.ts";
import { getDeptTreeApi } from "/@/api/organizStruct/orgStructMangerApi";
defineOptions({
  name: "UserList",
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
const sortColumn = ref<string | null>(null);
const sortType = ref<string | null>(null);
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
const statusSelectData = ref<any>([]);
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
const treeData: any = ref([]);

// 获得部门信息
const getDeptTree = async () => {
  await getDeptTreeApi({})
    .then((result: any) => {
      if (result.code == 200) {
        treeData.value = result.data;

      }
    })
    .catch((err) => {
      treeData.value = [];

    });
};


// 新增用户
const userDialogVisible = ref(false);
const userDialogList = ref<DialogProps>({});
const addClick = () => {
  userDialogVisible.value = true;
  userDialogList.value.modeType = "add";
  userDialogList.value.title = "新增";
};
const getOperate = () => {
  operateBtn.value = getTopButton([
    { name: "编辑", funName: "editClick" },
    { name: "重置密码", funName: "resetPassw" },
    { name: "设备号管理", funName: "deviceManger" },
  ]) as ButtonProps[];
};
const editClick = (pid: any) => {
  userDialogVisible.value = true;
  userDialogList.value.modeType = "edit";
  userDialogList.value.title = "编辑";
  // userDialogList.value.depts = depts;
  userDialogList.value.pid = pid;
};

//重置密码
const dialogVisibleRe = ref<boolean>(false);
const rePid = ref<string | number>("");
const resetPassw = async (pid: number) => {
  rePid.value = pid;
  // lookDialogVisible.value = false;
  dialogVisibleRe.value = true;
};

// 设备号管理
const deviceDialog = ref(false);
const devicePid = ref<string | number>("");
const deviceManger = async (pid: number) => {
  devicePid.value = pid;
  deviceDialog.value = true;
};

// 获取查询条件接口或json
const getQueryList = () => {
  queryList.value = [
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "姓名:",
      },
      bindVal: "truename",
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
        label: "手机号:",
      },
      bindVal: "phonenumber",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("请输入手机号"),
        clearable: true,
        autocomplete: "off",
        type: "text",
      },
    },
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "部门:",
      },
      bindVal: "deptname",
      curEleTag: "el-input",
      curOptions: {
        placeholder: translate("请输入部门"),
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
    { prop: "truename", label: "姓名" },

    { prop: "phonenumber", label: "手机号" },

    { prop: "sex", label: "性别" },

    { prop: "email", label: "邮箱" },

    { prop: "deptname", label: "部门" },

    { prop: "status", label: "状态", list: statusSelectData.value },

    { prop: "createdby", label: "创建人" },

    { prop: "createdtime", label: "创建时间" },

    { prop: "updatedtime", label: "更新时间" },
  ];
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

//列表行点击事件
const rowClick = (row: any, column: any, event: any) => {};

//列表勾选事件
const handleSelectionChange = (rows: any) => {
  selectedRows.value = rows.map((item: any) => {
    return item.pid;
  });
  console.log(selectedRows.value);
};



const map = new Map([
  ["searchClick", searchClick],
  ["resetClick", resetClick],
  ["addClick", addClick],
  ["editClick", editClick],
  ["resetPassw", resetPassw],
  ["deviceManger", deviceManger],
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

//字符串转函数方法--列表按钮方法

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
  let res: any = await getDeptUserList(params);
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
//生命周期hooks
onMounted(async () => {
  console.log(789);

  await getstatusSelectData();
  getQueryList();
  getButton();
  getTableColumns();
  getOperate();
  getTableList();
});
</script>

<style scoped lang="scss">
@use "/@/styles/base/base.scss";
</style>
