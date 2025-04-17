<template>
  <el-dialog
    v-model="dialogVisible"
    width="80%"
    title="用户管理"
    top="8vh"
    class="dialogbox"
  >
    <!-- <el-card class="box-card"> -->
    <el-container style="height: 73vh">
      <!-- 部门 -->
      <el-aside width="28%" style="padding: 20px">
        <div class="btn-left">
          <el-button
            color="#4484E8"
            size="default"
            @click="leftClick('addUserDept')"
            style="height: 40px; font-size: 16px"
          >
            取消部门分配
          </el-button>
        </div>
        <el-tree
          :data="data"
          :props="defaultProps"
          show-checkbox
          @check="handleNodeClick"
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultChecked"
          v-loading="treeLoading"
        />
      </el-aside>
      <!-- 用户列表 -->
      <el-main>
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
        </div>
      </el-main>
    </el-container>
    <!-- </el-card> -->
  </el-dialog>
</template>

<script setup lang="ts">
import buttonRef from "/@/components/global/buttonRef.vue";
import queryRef from "/@/components/global/queryRef.vue";
import tableRef from "/@/components/global/tableRef.vue";
// import editDialog from "/@/components/global/UserDialog.vue";
// import lookDialog from "/@/components/global/UserDetail.vue";
import type {
  TableColumnProps,
  TableProps,
  ButtonProps,
  JsonProps,
  DialogProps,
} from "/@/types/appinfo/AppAssignTypes.ts";
import {
  getAssignedTreeApi,
  getDataLisedDApi,
  getCancelUsersApi,
  getCancelDeptsApi,
} from "/@/api/appinfo/AppAssignUserApi.ts";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button.ts";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";

const dialogVisible = defineModel<boolean>("dialogVisible");
const pid = defineModel<number>("assignUserPid");
const route = useRoute();
let title: any = route.meta.title;
const btnRef = ref<any>();
const queRef = ref<any>();
const tableRefs = ref<any>();
const tableData = ref<TableProps[] | []>([]);
const tabloading = ref<boolean>(true);
const treeLoading = ref<boolean>(true);
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
let queryForm = reactive<any>({});
const selectedRows = ref<string[]>([]);
// 创建下拉框对象数组
const statusSelectData = ref<any>([]);
// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
  leftBtnObj.value = getTopButton([
    { name: "取消用户分配", funName: "addUserAssign" },
  ]) as ButtonProps[];
  rightBtnObj.value = getTopButton([
    { name: "搜索", funName: "searchClick" },
    { name: "重置", funName: "resetClick" },
  ]) as ButtonProps[];
};
// 部门
interface Tree {
  label: string;
  children?: Tree[];
}

const data = ref([]);
const defaultProps = {
  children: "children",
  label: "label",
  disabled: "dis",
};
const defaultChecked = ref([]);

watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    defaultChecked.value = [];
    tableData.value = [];
    await getDeptTree();
  } else {
    queryForm = reactive<any>({});
  }
});
// 获得部门信息
const getDeptTree = async () => {
  await getAssignedTreeApi({ applicationPid: pid.value })
    .then((result: any) => {
      if (result.code == 200) {
        // data.value = result.data;
        treeLoading.value = false;
        if (result.data == "") {
          data.value = [];
          ElMessage({ type: "info", message: result.msg });
        } else {
          data.value = result.data;
        }
      }
    })
    .catch((err) => {
      data.value = [];

      treeLoading.value = false;
    });
};

const handleNodeClick = async (data: Tree, status: any) => {
  defaultChecked.value = status.checkedKeys;
  getTableList();
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

    { prop: "status", label: "状态", list: statusSelectData.value },

    { prop: "createdby", label: "创建人" },

    { prop: "createdtime", label: "创建时间" },

    { prop: "updatedtime", label: "更新时间" },
  ];
};

const getOperate = () => {
  operateBtn.value = getTopButton([
    { name: "编辑", funName: "editClick" },
    { name: "查看", funName: "lookClick" },
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

//列表行点击事件
const rowClick = (row: any, column: any, event: any) => {};

//列表勾选事件
const handleSelectionChange = (rows: any) => {
  selectedRows.value = rows.map((item: any) => {
    return item.pid;
  });
  console.log(selectedRows.value);
};

//添加用户分配
const addUserAssign = async () => {
  if (selectedRows.value.length == 0) {
    ElMessage({
      type: "error",
      message: "请勾选需要取消的人员！",
    });
    return false;
  }
  const loading = ElLoading.service({
    lock: true,
    text: "正在添加",
    background: "rgba(0, 0, 0, 0.7)",
  });
  await getCancelUsersApi({
    userPids: selectedRows.value.join(","),
    applicationPid: pid.value,
    deptPids: defaultChecked.value.join(","),
  })
    .then(async (result: any) => {
      if (result.code == 200) {
        loading.close();
        ElMessage({ type: "success", message: result.msg });
        await getDeptTree();
        getTableList();
      }
    })
    .catch((err) => {
      loading.close();
    });
};
// 取消科室分配
const addUserDept = async () => {
  if (defaultChecked.value.length === 0) {
    ElMessage({
      type: "error",
      message: "请勾选需要取消的部门！",
    });
    return false;
  }
  const loading = ElLoading.service({
    lock: true,
    text: "正在添加",
    background: "rgba(0, 0, 0, 0.7)",
  });

  await getCancelDeptsApi({
    deptPids: defaultChecked.value.join(","),
    applicationPid: pid.value,
  })
    .then(async (result: any) => {
      if (result.code == 200) {
        loading.close();
        ElMessage({ type: "success", message: result.msg });
        await getDeptTree();
        getTableList();
      }
    })
    .catch((err) => {
      loading.close();
    });
};

// //字符串转函数方法--列表按钮方法
// const operateClick = (name: string, pid: number) => {
//   const func = eval(name);
//   console.log(name, pid);
//   // dialogList.value.parentEleTag = 'el-dialog'

//   func(pid);
// };

const map = new Map([
  ["searchClick", searchClick],
  ["resetClick", resetClick],
  ["addUserAssign", addUserAssign],
  ["addUserDept", addUserDept],
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
//获取列表数据事件
const getTableList = async () => {
  if (defaultChecked.value.length === 0) {
    tableData.value = [];
    tabloading.value = false;
    return false;
  }
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    sortType: sortType.value,
    sortColumn: sortColumn.value,
    deptPids: defaultChecked.value.join(","),
    applicationPid: pid.value,
  };
  let arr = Object.keys(queryForm);
  for (let i in queryForm) {
    if (arr.includes(i)) {
      Object.assign(params, queryForm);
    }
  }
  let res: any = await getDataLisedDApi(params);
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
  await getstatusSelectData();
  getQueryList();
  getButton();
  getTableColumns();
  // await getOperate();
  await getTableList();
});
</script>

<style scoped lang="scss">
@use "/@/styles/listpage/listpage.scss";
@use "/@/styles/base/base.scss";
</style>
<style scoped lang="scss">
.el-aside {
  border-right: 1px solid gainsboro;
}
.el-tree {
  margin-top: 20px;
}
.el-card {
  height: 72vh;
  min-height: unset;
}
</style>
