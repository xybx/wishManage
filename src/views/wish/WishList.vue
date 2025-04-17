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
      <lookWishreplyListDialog
          ref="lookRef"
          v-model:dialogVisible="WishreplyListDialogVisible"
          v-model:dialogList="WishreplyListDialogList"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import buttonRef from "/@/components/global/buttonRef.vue";
  import queryRef from "/@/components/global/queryRef.vue";
  import tableRef from "/@/components/global/tableRef.vue";
  import lookDialog from "/@/views/wish/components/WishDetail.vue";
  import lookWishreplyListDialog from "/@/views/wish/components/WishReplay.vue";
  
  import type {
    TableColumnProps,
    TableProps,
    ButtonProps,
    JsonProps,
    DialogProps,
  } from "/@/types/wish/WishTypes";
  import { getDataListApi, del, putMultiDel
  } from "/@/api/wish/WishApi";
  import { translate } from "/@/i18n";
  import { getTopButton } from "/@/utils/Button";
  import { ElMessage, ElMessageBox } from "element-plus";
import { de } from "element-plus/es/locale";
  defineOptions({
    name: 'WishList',
  });
  import Utils from "~/src/utils/base64";


  let baseUtil = new Utils();
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
  const operateBtnWidth = ref<number>(200)
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

  const WishreplyListDialogVisible = ref<boolean>(false);
  const WishreplyListDialogList = ref<DialogProps>({});

  const wishtypeSelectData = ref<any[]|[]>([]);
  const ShareWaySelectData = ref<any[]|[]>([]);
  const commonSelectData = ref<any[]|[]>([]);
  const publicData = ref<any[]|[]>([]);

  const getwishtypeSelectData =async () =>{
     let tempSelectData=[{label:"为自己",value:'0'},{label:"为他人",value:'1'}]
     let arr:any[] = tempSelectData.map((item:any)=>{
        return {
            label:item.label,
            value:item.value
        }
     })
     wishtypeSelectData.value = arr   
  }
  const getShareWaySelectData =async () =>{
     let tempSelectData=[{label:"无互助",value:'0'},{label:"自助互助",value:'1'},{label:"官方互助",value:'2'}]
     let arr:any[] = tempSelectData.map((item:any)=>{
        return {
            label:item.label,
            value:item.value
        }
     })
     ShareWaySelectData.value = arr   
  }
  const getcommonSelectData =async () =>{
     let tempSelectData=[{label:"否",value:0},{label:"是",value:1}]
     let arr:any[] = tempSelectData.map((item:any)=>{
        return {
            label:item.label,
            value:item.value
        }
     })
     commonSelectData.value = arr
  }

  const getpublicData =async () =>{
     let tempSelectData=[{label:"否",value:0},{label:"是",value:1}]
     let arr:any[] = tempSelectData.map((item:any)=>{
        return {
            label:item.label,
            value:item.value
        }
     })
     publicData.value = arr
  }
  // 创建下拉框对象数组
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
            label:'许愿人ID:',
        },
        bindVal: 'userid',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('许愿人ID'),
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
        bindVal: 'usernickname',
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
            label:'许愿内容:',
        },
        bindVal: 'wishcontent',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('许愿内容'),
             clearable: true,
             autocomplete: "off",
             type: "text",
        },
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'位置:',
        },
        bindVal: 'wishaddress',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('发起许愿的位置'),
             clearable: true,
             autocomplete: "off",
             type: "text",
        },
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'ip:',
        },
        bindVal: 'wiship',
        curEleTag: "el-input",
        curOptions: {
             placeholder: translate('发起许愿的ip'),
             clearable: true,
             autocomplete: "off",
             type: "text",
        },
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'许愿日期:',
        },
        bindVal: 'wishtime',
        curEleTag: "el-date-picker",
        curOptions: {
              clearable: true,
              type: "datetimerange",
                    "range-separator": "至",
                    "start-placeholder": "开始日期",
                    "end-placeholder": "结束日期",
              format: "YYYY-MM-DD HH:mm:ss",
                    "value-format": "YYYY-MM-DD HH:mm:ss",
             },

      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'许愿类型:',
        },
        bindVal: 'wishtype',
        curEleTag: "el-select",
        childEleTag: "el-option",
        curOptions: {
              placeholder:translate('许愿类型'),
              clearable: true,
        },
        childOptions: wishtypeSelectData.value,
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'是否完成:',
        },
        bindVal: 'complete',
        curEleTag: "el-select",
        childEleTag: "el-option",
        curOptions: {
              placeholder:translate('是否完成'),
              clearable: true,
        },
        childOptions: commonSelectData.value,
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'是否公开:',
        },
        bindVal: 'ispublic',
        curEleTag: "el-select",
        childEleTag: "el-option",
        curOptions: {
              placeholder:translate('是否公开'),
              clearable: true,
        },
        childOptions: publicData.value,
      }
      ,
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'互助类型:',
        },
        bindVal: 'shareway',
        curEleTag: "el-select",
        childEleTag: "el-option",
        curOptions: {
              placeholder:translate('互助类型'),
              clearable: true,
        },
        childOptions: ShareWaySelectData.value,
      }
  ]};
  //格式化表格某些字段的数据
  const formatStatus = (obj: any) => {
    return obj == 0 ? "未办理" : "已办理";
  };

  //列表字段数据获取或json配置
  const getTableColumns = () => {
    tableColumns.value = [
                    {prop: 'pid', label: 'ID',sortable:true},
                    {prop: 'userid', label: '许愿人ID',sortable:true},
                    {prop: 'usernickname', label: '许愿时的昵称',sortable:true},

                    {prop: 'wishaddress', label: '发起许愿的位置',sortable:true},

                    {prop: 'wishcontent', label: '许愿内容',sortable:true},

                    {prop: 'wiship', label: '许愿的ip',sortable:true},

                    {prop: 'wishnum', label: '许愿编号',sortable:true},

                    {prop: 'wishtime', label: '许愿日期',sortable:true},

                    {prop: 'wishtype', label: '许愿类型',sortable:true,list:wishtypeSelectData.value },

                    {prop: 'assist', label: '助力次数',sortable:true},

                    {prop: 'complete', label: '是否完成',sortable:true,list:commonSelectData.value},

                    {prop: 'ispublic', label: '是否公开',sortable:true,list:publicData.value},

                    {prop: 'receivecode', label: '愿望查看验证码',sortable:true},

                    {prop: 'receivemobile', label: '愿望接收人手机号',sortable:true},

                    {prop: 'receivestatue', label: '是否接收',sortable:true,list:commonSelectData.value},

                    {prop: 'updatetime', label: '数据更新时间',sortable:true},

     ]
  }

  const getOperate = () => {
    operateBtn.value = getTopButton([
      { name: "查看", funName: "lookClick" },
      { name: "删除", funName: "delClick" },
      { name: "查看消息", funName: "seereplayListWishClick" },
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

  const seereplayListWishClick = (pid: number,row:any) => {
  debugger;
  WishreplyListDialogList.value.modeType = "look";
  WishreplyListDialogList.value.title = "查看消息";
  WishreplyListDialogList.value.pid = pid;
  WishreplyListDialogVisible.value = true;
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

  //需要触发的按钮需要在这里定义一下
  const map = new Map([
    ['addClick',addClick],
    ['batchDel',batchDel],
    ['searchClick',searchClick],
    ['resetClick',resetClick],
    ['editClick',editClick],
    ['lookClick',lookClick],
    ['delClick',delClick],
    ['seereplayListWishClick',seereplayListWishClick],

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
    debugger;
    let arr = Object.keys(queryForm);
    for (let i in queryForm) {
      //无时间段可直接使用
     // if (arr.includes(i)) {
      //  Object.assign(params, queryForm);
     // }
      //有时间段需自行获取值之后赋值相应属性
       if (arr.includes(i)) {
         if (i == "wishtime" && queryForm[i]) {
           params.wishtimestarttime = queryForm[i][0];
           params.wishtimeendtime = queryForm[i][1];
         } else {
           params[i] = queryForm[i];
         }
       }
    }
    let res: any = await getDataListApi(params);
    if (res.code == 200) {
      var data=res.data.list
      const formattedData = data.map(item => ({
        ...item,
        wishcontent: baseUtil.base64_decode(item.wishcontent)
     }));
      tableData.value = formattedData;
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
  //生命周期hooks
  onMounted(async () => {
    await getShareWaySelectData();
    await getwishtypeSelectData();
    await getcommonSelectData();
    await getpublicData();
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
