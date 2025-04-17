<template>
  <div>
    <el-card class="box-card">
      <el-container>
        <!-- 部门 -->
        <el-aside width="22%" style="padding: 20px">
          <el-input
            v-model="filterText"
            style="width: 240px"
            placeholder="请输入组织架构名称"
          />
          <el-tree
            ref="treeRef"
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            v-loading="treeLoading"
            :expand-on-click-node="false"
            :default-checked-keys="[defaultChecked]"
            :filter-node-method="filterNode"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node"  >
                <div class="label"  @click="handleNodeClick(data)">
                  {{ node.label }}
                </div>
                <!-- <div>
                <a @click="addorg(data)"> 新增 </a>
                <a @click="editorg(data)"> 编辑 </a>
                <a @click="delorg(data)"> 删除 </a>
              </div> -->
              </div>
            </template>
          </el-tree>
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
              v-model:operateBtnWidth="operateBtnWidth"
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
    </el-card>

    <UserDialog
      v-model:dialogVisible="userDialogVisible"
      @getData="getTableList"
      v-model:dialogList="userDialogList"
    />
    <resetPassword
      v-model:dialogVisible="dialogVisibleRe"
      v-model:pid="rePid"
    />
    <TransferDepts
      v-model:dialogVisible="transDialogVisible"
      @getData="getTableList"
      v-model:dialogList="transDialogList"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import buttonRef from "/@/components/global/buttonRef.vue";
import queryRef from "/@/components/global/queryRef.vue";
import tableRef from "/@/components/global/tableRef.vue";
import UserDialog from "./components/orgStructManger/UserDialog.vue";
import resetPassword from "./components/orgStructManger/resetPassword.vue";
import TransferDepts from "./components/orgStructManger/TransferDepts.vue";
import type {
  TableColumnProps,
  TableProps,
  ButtonProps,
  JsonProps,
  DialogProps,
} from "/@/types/appinfo/AppAssignTypes.ts";
import {
  getDeptTreeApi,
  getDeptUserList,
} from "/@/api/organizStruct/orgStructMangerApi";
import { translate } from "/@/i18n";
import { getTopButton } from "/@/utils/Button.ts";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";

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
const operateBtnWidth = ref<number>(200);
const sortColumn = ref<string | null>(null);
const sortType = ref<string | null>(null);
const labelwidth = ref<string>("80px");
const queryList = ref<JsonProps[] | []>([]);
let queryForm = reactive<any>({});
const selectedRows = ref<string[]>([]);
// 创建下拉框对象数组
const statusSelectData = ref<any>([]);
// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
  rightBtnObj.value = getTopButton([
    { name: "搜索", funName: "searchClick" },
    { name: "重置", funName: "resetClick" },
  ]) as ButtonProps[];
};

const customNodeClass = (data: any, node: Node) => {
  if (data.isPenultimate) {
    return "is-penultimate";
  }
  return null;
};
// 部门
interface Tree {
  label: string;
  children?: Tree[];
  isPenultimate?: boolean;
}

const treeData: any = ref([]);
const defaultProps: any = {
  children: "children",
  label: "label",
  class: customNodeClass,

};

let defaultChecked = "";
const depts: any = [];
// 获得部门信息
const getDeptTree = async () => {
  await getDeptTreeApi({})
    .then((result: any) => {
      if (result.code == 200) {
        treeData.value = result.data;
        handleNodeClick(result.data[0])
        treeLoading.value = false;
      }
    })
    .catch((err) => {
      treeData.value = [];
      treeLoading.value = false;
    });
};

const handleNodeClick = async (data: any) => {
  console.log(data);
  if (data.data == 0) {
    leftBtnObj.value = [];
  } else {
    leftBtnObj.value = getTopButton([
      { name: "新增", funName: "addClick" },
    ]) as ButtonProps[];
    if (data.children.length <= 0) {
      leftBtnObj.value = getTopButton([
      { name: "新增", funName: "addClick" },
        { name: "转移", funName: "transferClick" },
      ]) as ButtonProps[];
    }
  }
  clearHightlight(treeData.value);
  data.isPenultimate = true;
  defaultChecked = data.id;
  depts[0] = {
    deptname: data.label,
    pid: data.id,
  };

  getTableList();
};
const transDialogVisible = ref(false);
const transDialogList: any = ref({});
// 人员转移
const transferClick = async () => {
  if (selectedRows.value.length == 0) {
    ElMessage({
      type: "error",
      message: "请勾选需要转移的人员！",
    });
    return false;
  }
  transDialogList.value.userPids = selectedRows.value.join(",");
  transDialogList.value.depts = treeData.value;
  transDialogList.value.deptPid = defaultChecked;
  transDialogVisible.value = true;

  // ElMessageBox.confirm("确定要转移所选的人员吗", "转移提示")
  //   .then(async () => {
  //     let params = { pids: selectedRows.value.join(",") };
  //     let res: any = await changeUserDeptApi(params);
  //     if (res.code == 200) {
  //       ElMessage.success("删除成功");
  //       getTableList();
  //     } else {
  //       ElMessage.error("删除失败");
  //     }
  //   })
  //   .catch(() => {
  //     ElMessage("取消删除");
  //   });
};
// 清除高亮
const clearHightlight = (data: any) => {
  data.map((item: any) => {
    item.isPenultimate = false;
    if (item.children.length === 0) {
      return false;
    } else {
      clearHightlight(item.children);
    }
  });
};

// 搜索
let filterText = ref("");
const treeRef = ref();
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode: any = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};

// 新增用户
const userDialogVisible = ref(false);
const userDialogList = ref<DialogProps>({});
const addClick = () => {
  userDialogVisible.value = true;
  userDialogList.value.modeType = "add";
  userDialogList.value.title = "新增";
  userDialogList.value.depts = depts;
};
const getOperate = () => {
  operateBtn.value = getTopButton([
    { name: "编辑", funName: "editClick" },
    { name: "重置密码", funName: "resetPassw" },
  ]) as ButtonProps[];
};
const editClick = (pid: any) => {
  userDialogVisible.value = true;
  userDialogList.value.modeType = "edit";
  userDialogList.value.title = "编辑";
  userDialogList.value.depts = depts;
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


const map = new Map([
  ["searchClick", searchClick],
  ["resetClick", resetClick],
  ["addClick", addClick],
  ["transferClick", transferClick],
  ["editClick", editClick],
  ["resetPassw", resetPassw],
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
  console.log(selectedRows.value);
};

//字符串转函数方法--列表按钮方法
// const operateClick = (name: string, pid: number) => {
//   const func = eval(name);
//   func(pid);
// };

//获取列表数据事件
const getTableList = async () => {
  if (defaultChecked === "") {
    tableData.value = [];
    tabloading.value = false;
    return false;
  }
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    sortType: sortType.value,
    sortColumn: sortColumn.value,
    deptPid: defaultChecked,
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
  await getDeptTree();
  await getstatusSelectData();
  getQueryList();
  getButton();
  getOperate();
  getTableColumns();
  // await getTableList();
});
</script>

<style scoped lang="scss">
@use "/@/styles/base/base.scss";
</style>
<style scoped lang="scss">
.el-aside {
  border-right: 1px solid gainsboro;
}
:deep(.el-tree) {
  .is-penultimate > .el-tree-node__content .label {
    color: #409eff;
  }

  margin-top: 20px;
  .el-tree-node__expand-icon {
    font-size: 0.9vw;
  }
  .custom-tree-node {
    flex: 1;
    .label {
      &:hover {
        color: #409eff;
      }
    }

    // a {
    //   margin-left: 8px;
    //   color: #606266;
    //   &:hover {
    //     color: #409eff;
    //   }
    // }
  }
}
</style>
