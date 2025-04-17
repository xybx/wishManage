<template>
  <el-dialog v-model="dialogVisible" width="62%" title="设备号管理" top="8vh" class="dialogbox">
    <!-- <el-card class="box-card"> -->
      <!-- 设备号列表 -->
      <el-main style="height: 73vh">
        <!-- <template #header>
          <div class="card-header">
            <span>{{ title }}</span>
          </div>
        </template> -->
        <div class="text item">
          <buttonRef
            ref="btnRef"
            :leftBtn="leftBtnObj"
            :rightBtn="rightBtnObj"
            @leftClick="leftClick"
          />
          <!-- <queryRef
            ref="queRef"
            v-model:queryForm="queryForm"
            :queryData="queryList"
            v-model:labelwidth="labelwidth"
          /> -->
          <tableRef
            ref="tableRefs"
            v-model:tableData="tableData"
            v-model:tableColumns="tableColumns"
            v-model:tabloading="tabloading"
            v-model:loadingText="loadingText"
            v-model:operateBtn="operateBtn"
            :operateBtnWidth="250"
            :fit="true"
            @sortClick="sortChange"
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
          <AddDevice
            v-model:dialogVisible="addDialogVisible"
            @getData="getTableList"
            v-model:dialogList="addDialogList"
          ></AddDevice>
        </div>
      </el-main>
    <!-- </el-card> -->
  </el-dialog>
</template>

<script setup lang="ts">
import buttonRef from "/@/components/global/buttonRef.vue";
import queryRef from "/@/components/global/queryRef.vue";
import tableRef from "/@/components/global/tableRef.vue";
import AddDevice from "./AddDevice.vue";
import type {
  TableColumnProps,
  TableProps,
  ButtonProps,
  JsonProps,
} from "/@/types/orgStruct/deviceListTypes.ts";
import { getDeviceListApi,del } from "/@/api/organizStruct/deviceListApi.ts";
import { getTopButton } from "/@/utils/Button.ts";
import { ElMessage, ElMessageBox } from "element-plus";

const dialogVisible = defineModel<boolean>("dialogVisible");
const pid = defineModel("pid");
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
let queryForm = reactive<any>({});
const selectedRows = ref<string[]>([]);
// 创建下拉框对象数组
// 获取头部左侧及右侧按钮配置或自己配置json
const getButton = () => {
  leftBtnObj.value = getTopButton([
    { name: "新增", funName: "addClick" },
  ]) as ButtonProps[];
};
const getOperate = () => {
  operateBtn.value = getTopButton([
    { name: "编辑", funName: "editClick" },
    { name: "删除", funName: "delClick" },
  ]) as ButtonProps[];
};

watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    getTableList();
  }else{
    queryForm =reactive<any>({});
  }
});

// 添加
const addDialogVisible = ref(false);
const addDialogList: any = ref({});
const addClick = () => {
  addDialogVisible.value = true;
  addDialogList.value.modeType = "add";
  addDialogList.value.title = "新增";
  addDialogList.value.pid = pid.value;
};
const editClick = (pid: any) => {
  addDialogVisible.value = true;
  addDialogList.value.modeType = "edit";
  addDialogList.value.title = "编辑";
  addDialogList.value.pid = pid;
};
const delClick = async (pid: number) => {
  console.log(pid);
  ElMessageBox.confirm(`确定要删除该条设备号信息吗?`).then(
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


//格式化表格某些字段的数据
const formatStatus = (obj: any) => {
  return obj == 0 ? "未办理" : "已办理";
};

//列表字段数据获取或json配置
const getTableColumns = () => {
  tableColumns.value = [
    { prop: "devicenum", label: "设备号" },
    { prop: "remark", label: "说明" },
    { prop: "createdby", label: "创建人" },
    { prop: "createdtime", label: "创建时间" },
  ];
};

const map = new Map([
  ["addClick", addClick],
  ["editClick", editClick],
  ["delClick", delClick],
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
    userId: pid.value,
  };
  let arr = Object.keys(queryForm);
  for (let i in queryForm) {
    if (arr.includes(i)) {
      Object.assign(params, queryForm);
    }
  }
  let res: any = await getDeviceListApi(params);
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

//生命周期hooks
onMounted(async () => {
  getButton();
  getOperate();
  getTableColumns();
});
</script>

<style scoped lang="scss">
@use "/@/styles/listpage/listpage.scss";
@use "/@/styles/base/base.scss";
</style>

