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
          v-model:operateBtnWidth="operateBtnWidth"
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
     
      <lookDialog
          ref="lookRef"
          v-model:detailVisible="detailVisible"
          v-model:detailList="detailList"
      />
      <lookWishreplyDialog
          ref="lookRef"
          v-model:dialogVisible="WishreplyDialogVisible"
          v-model:dialogList="WishreplyDialogList"
      />
      <lookWishreplyListDialog
          ref="lookRef"
          v-model:dialogVisible="WishreplyListDialogVisible"
          v-model:dialogList="WishreplyListDialogList"
      />
      <lookaddressListDialog
          ref="lookRef"
          v-model:dialogVisible="ReceiveaddressListDialogVisible"
          v-model:dialogList="ReceiveaddressListDialogList"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import buttonRef from "/@/components/global/buttonRef.vue";
  import queryRef from "/@/components/global/queryRef.vue";
  import tableRef from "/@/components/global/tableRef.vue";
  import lookDialog from "./components/orgUserManger/UserDetail.vue";
  import lookWishreplyDialog from "/@/views/appInfo/components/WishreplyDialog.vue";
  import lookWishreplyListDialog from "/@/views/appInfo/components/WishreplyListDialog.vue";
  import lookaddressListDialog from "/@/views/appInfo/ReceiveadddressList.vue";
  import type {
    TableColumnProps,
    TableProps,
    ButtonProps,
    JsonProps,
    DialogProps,
  } from "/@/types/orgStruct/UserTypes";
  import { getDataListApi, del, putMultiDel,unsuspendAccount,suspendAccount
  } from "/@/api/organizStruct/UserApi";
  import { translate } from "/@/i18n";
  import { getTopButton } from "/@/utils/Button";
  import { ElMessage, ElMessageBox } from "element-plus";
  defineOptions({
    name: 'UserList',
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
  const operateBtnWidth = ref<number>(300)
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

  const WishreplyDialogVisible = ref<boolean>(false);
  const WishreplyDialogList = ref<DialogProps>({});

  const WishreplyListDialogVisible = ref<boolean>(false);
  const WishreplyListDialogList = ref<DialogProps>({});

  const ReceiveaddressListDialogVisible = ref<boolean>(false);
  const ReceiveaddressListDialogList = ref<DialogProps>({});

  const dialogVisible = ref<boolean>(false);
  const dialogList = ref<DialogProps>({});
  const detailVisible = ref<boolean>(false);
  const detailList = ref<DialogProps>({});
  // 创建下拉框对象数组
  const statusSelectData = ref<any[]|[]>([])
  // 获取头部左侧及右侧按钮配置或自己配置json
  const getButton = () => {
    leftBtnObj.value = getTopButton([
  
    ]) as ButtonProps[];
    rightBtnObj.value = getTopButton([
      { name: "搜索", funName: "searchClick" },
      { name: "重置", funName: "resetClick" },
    ]) as ButtonProps[];
  };
  const getTableOptions = () => {
  };

  // 获取查询条件接口或json
  const getQueryList = () => {
    queryList.value = [
    {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'用户状态:',
        },
        bindVal: 'status',
        curEleTag: "el-select",
        childEleTag: "el-option",
        curOptions: {
              placeholder:translate('用户状态'),
              clearable: true,
        },
        childOptions: statusSelectData.value,
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'ID:',
        },
        bindVal: 'pid',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('ID'),
             clearable: true,
             autocomplete: "off",
             type: "text",
        },
      },
    {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'昵称:',
        },
        bindVal: 'nickname',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('昵称'),
             clearable: true,
             autocomplete: "off",
             type: "text",
        },
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'城市:',
        },
        bindVal: 'city',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('城市'),
             clearable: true,
             autocomplete: "off",
             type: "text",
        },
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'登录地点:',
        },
        bindVal: 'loginaddress',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('登录地点'),
             clearable: true,
             autocomplete: "off",
             type: "text",
        },
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'登录ip:',
        },
        bindVal: 'loginip',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('登录ip'),
             clearable: true,
             autocomplete: "off",
             type: "text",
        },
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'登录时间:',
        },
        bindVal: 'logindate',
        curEleTag: "el-date-picker",
        curOptions: {
              clearable: true,
              type: "datetimerange",
                    "range-separator": "至",
                    "start-placeholder": "开始时间",
                    "end-placeholder": "结束时间",
              format: "YYYY-MM-DD HH:mm:ss",
                    "value-format": "YYYY-MM-DD HH:mm:ss",
             },

      },
        {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'周次时间:',
        },
        bindVal: 'weekslogindatebg',
        curEleTag: "el-date-picker",
        curOptions: {
             placeholder: translate('周次时间'),
             clearable: true,
             autocomplete: "off",
             type: "datetime",
        },
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'周次:',
        },
        bindVal: 'weeks',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('周次'),
             clearable: true,
             autocomplete: "off",
             type: "text",
        },
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'登录次数:',
        },
        bindVal: 'lgtimes',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('登录次数'),
             clearable: true,
             autocomplete: "off",
             type: "text",
        },
      },
       {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'推荐人ID:',
        },
        bindVal: 'promoterid',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('推荐人ID'),
             clearable: true,
             autocomplete: "off",
             type: "text",
        },
      },
  ]};
  //格式化表格某些字段的数据
  const formatStatus = (obj: any) => {
    return obj == 0 ? "未办理" : "已办理";
  };

  //列表字段数据获取或json配置
  const getTableColumns = () => {
    tableColumns.value = [
                    {prop: 'pid', label: 'ID',sortable:true},
                    {prop: 'nickname', label: '昵称',sortable:true},
                    {prop: 'wishpower', label: '心愿力',sortable:true},
                    {prop: 'status', label: '用户状态',sortable:true,list:statusSelectData.value },
                    {prop: 'createdtime', label: '注册时间',sortable:true},
                    {prop: 'updatedby', label: '更新人',sortable:true},
                    {prop: 'updatedtime', label: '更新时间',sortable:true},
                    {prop: 'loginip', label: '登录ip',sortable:true},
                    {prop: 'logindate', label: '登录时间',sortable:true},
                    {prop: 'loginaddress', label: '登录地点',sortable:true},

                  
                   

     ]
  }

  const getOperate = () => {
    operateBtn.value = getTopButton([
      { name: "查看", funName: "lookClick" },
      { name: "封号", funName: "suspendAccountClick" },
      { name: "解封", funName: "unsuspendAccountClick" },
      { name: "回复消息", funName: "replayWishClick" },
      { name: "官方消息", funName: "seereplayListWishClick" },
      { name: "收货地址", funName: "seeaddressListWishClick" },
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

  //查看事件
  const lookClick = (pid: number) => {
    detailList.value.modeType = "look";
    detailList.value.title = "查看";
    detailList.value.pid = pid;
    detailVisible.value = true;
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
  //封号
  const suspendAccountClick = async (pid: number) => {
    console.log(pid);
    ElMessageBox.confirm(`确定要封号?`).then(
        async () => {
          let res = (await suspendAccount({ pid: pid })) as any;
          console.log(res);
          if (res.code == 200) {
            ElMessage.success("操作成功");
            getTableList();
          } else {
            ElMessage.error(res.msg);
          }
        },
        () => {
          ElMessage("取消操作");
        }
    );
  };
  //解封
  const unsuspendAccountClick = async (pid: number) => {
    console.log(pid);
    ElMessageBox.confirm(`确定要解封?`).then(
        async () => {
          let res = (await unsuspendAccount({ pid: pid })) as any;
          console.log(res);
          if (res.code == 200) {
            ElMessage.success("操作成功");
            getTableList();
          } else {
            ElMessage.error(res.msg);
          }
        },
        () => {
          ElMessage("取消操作");
        }
    );
  };
//愿望回复
const replayWishClick = (pid: number,row:any) => {
  debugger;
    WishreplyDialogList.value.modeType = "look";
    WishreplyDialogList.value.title = "愿望回复";
    WishreplyDialogList.value.pid = pid;
    WishreplyDialogList.value.subData=pid;
    WishreplyDialogVisible.value = true;
  };
  //官方回复列表
const seereplayListWishClick = (pid: number,row:any) => {
  debugger;
  WishreplyListDialogList.value.modeType = "look";
  WishreplyListDialogList.value.title = "官方回复列表";
  WishreplyListDialogList.value.pid = pid;
  WishreplyListDialogList.value.subData=pid;
  WishreplyListDialogVisible.value = true;
  };

    //收货地址
const seeaddressListWishClick = (pid: number,row:any) => {

  ReceiveaddressListDialogList.value.modeType = "look";
  ReceiveaddressListDialogList.value.title = "收货地址";
  ReceiveaddressListDialogList.value.pid = pid;
  ReceiveaddressListDialogList.value.subData=pid;
  ReceiveaddressListDialogVisible.value = true;
  };
  //需要触发的按钮需要在这里定义一下
  const map = new Map([
    ['addClick',addClick],
    ['batchDel',batchDel],
    ['searchClick',searchClick],
    ['resetClick',resetClick],
    ['editClick',editClick],
    ['lookClick',lookClick],
    ['delClick',delClick],
    ['suspendAccountClick',suspendAccountClick],
    ['unsuspendAccountClick',unsuspendAccountClick],
    ['replayWishClick',replayWishClick],
    ['seereplayListWishClick',seereplayListWishClick],
    ['seeaddressListWishClick',seeaddressListWishClick],

  ])

  //字符串转函数方法--列表按钮方法
  const operateClick = (name: string, pid: number,row:any) => {
      if(map.has(name)){
        const func:any = map.get(name);
        console.log(name, pid);
        // dialogList.value.parentEleTag = 'el-dialog'

        func(pid);
      }
  };

  //获取列表数据事件
  const getTableList = async () => {
    let params: any = { pageNum: pageNum.value, pageSize: pageSize.value,sortType:sortType.value,sortColumn:sortColumn.value };
    let arr = Object.keys(queryForm);
    for (let i in queryForm) {
      //无时间段可直接使用
      //if (arr.includes(i)) {
      //  Object.assign(params, queryForm);
     // }
      //有时间段需自行获取值之后赋值相应属性
       if (arr.includes(i)) {
         if (i == "logindate" && queryForm[i]) {
           params.logindatebg = queryForm[i][0];
           params.logindateend = queryForm[i][1];
         } else {
           params[i] = queryForm[i];
         }
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
  const getstatusSelectData =async () =>{
     let tempSelectData=[{label:"停用",value:"0"},{label:"启用",value:"1"}]
     let arr:any[] = tempSelectData.map((item:any)=>{
        return {
            label:item.label,
            value:item.value
        }
     })
     statusSelectData.value = arr
  }
  
  //生命周期hooks
  onMounted(async () => {
    await getstatusSelectData()
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
