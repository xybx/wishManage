<template>
  <el-dialog
    v-model="dialogVisible"
    width="70%"
    title="在线用户"
    top="8vh"
    class="dialogbox"
  >
    <!-- <el-card class="box-card"> -->
    <!-- 设备号列表 -->
    <!-- <el-main > -->
    <!-- <template #header>
          <div class="card-header">
            <span>{{ title }}</span>
          </div>
        </template> -->
    <div class="text item" style="height: 70vh">
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
        :fit="true"
        :operateBtnWidth="250"
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
    </div>
    <!-- </el-main> -->
    <!-- </el-card> -->
  </el-dialog>
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
} from "/@/types/orgStruct/deviceListTypes.ts";
import { getDataListApi } from "/@/api/appinfo/onlineListApi";
import { getTopButton } from "/@/utils/Button.ts";

const dialogVisible = defineModel<boolean>("dialogVisible");
const dialogList = defineModel<any>("pid");
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
  rightBtnObj.value = getTopButton([
    { name: "搜索", funName: "searchClick" },
    { name: "重置", funName: "resetClick" },
  ]) as ButtonProps[];
};

watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    getTableList();
  }else{
    queryForm =reactive<any>({});
  }
});

const getQueryList = () => {
  queryList.value = [
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "姓名:",
      },
      bindVal: "username",
      curEleTag: "el-input",
      curOptions: {
        placeholder: "请输入姓名",
        clearable: true,
        autocomplete: "off",
        type: "text",
      },
    },
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "登录IP:",
      },
      bindVal: "ip",
      curEleTag: "el-input",
      curOptions: {
        placeholder: "请输入登录IP",
        clearable: true,
        autocomplete: "off",
        type: "text",
      },
    },
    {
      parentEleTag: "el-form-item",
      parentOptions: {
        label: "登录时间:",
      },
      bindVal: "lgtime",
      curEleTag: "el-date-picker",
      curOptions: {
        clearable: true,
        type: "datetimerange",
        "range-separator": "至",
        "start-placeholder": "登录开始日期",
        "end-placeholder": "登录结束日期",
        format: "YYYY-MM-DD HH:mm:ss",
        "value-format": "YYYY-MM-DD HH:mm:ss",
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
    { prop: "username", label: "姓名" },

    { prop: "ip", label: "登录IP" },

    { prop: "address", label: "登录地点" },

    { prop: "os", label: "操作系统" },

    { prop: "browser", label: "终端类型" },

    { prop: "lgtime", label: "登录时间" },
  ];
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

// //字符串转函数方法--列表按钮方法
// const operateClick = (name: string, pid: number) => {
//   const func = eval(name);
//   console.log(name, pid);
//   // dialogList.value.parentEleTag = 'el-dialog'

//   func(pid);
// };

//获取列表数据事件
let getTableList = async () => {
  let params: any = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    sortType: sortType.value,
    sortColumn: sortColumn.value,
    appid: dialogList.value.pid,
  };
  let arr = Object.keys(queryForm);
  for (let i in queryForm) {
    if (arr.includes(i)) {
      if (i == "lgtime") {
        params.startTime = queryForm[i][0];
        params.endTime = queryForm[i][1];
      } else {
        params[i] = queryForm[i];
      }
    }
  }
  getDataListApi(params, dialogList.value.url).then((result: any) => {
    console.log(result, result.data.code);
    if (result.data.code == 200) {
      tableData.value = result.data.data.list;
      total.value = result.data.data.total;
    } else {
      tableData.value = [];
      total.value = 0;
    }
  });
  // console.log(res);

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
//生命周期hooks
onMounted(async () => {
  getQueryList();
  getButton();
  getTableColumns();
});
</script>

<style scoped lang="scss">
@use "/@/styles/listpage/listpage.scss";
@use "/@/styles/base/base.scss";
</style>

