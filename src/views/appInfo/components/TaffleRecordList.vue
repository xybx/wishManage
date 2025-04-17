<template>
     <component :is="dialogList?.parentEleTag" v-bind="dialogList?.parentOptions">
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
            @operateClick="inneroperateClick"
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
     </component>
        
    
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
      DialogProps,
    } from "/@/types/appinfo/TaffleRecordTypes";
    import { getDataListApi, actaffleComplate, acbatchTaffleComplate} from "/@/api/appinfo/TaffleRecordApi";
    import { translate } from "/@/i18n";
    import { getTopButton } from "/@/utils/Button";
    import { ElMessage, ElMessageBox } from "element-plus";
    defineOptions({
      name: 'TaffleRecordList',
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
    const innnerdialogVisible = ref<boolean>(false);
    const innnerdialogList = ref<DialogProps>({});

    const dialogVisible = defineModel<boolean>("dialogVisible");
    const dialogList = defineModel<DialogProps | any>("dialogList");

    // 创建下拉框对象数组
    const ishitSelectData = ref<any[]|[]>([])
    const iscashSelectData = ref<any[]|[]>([])
    // 获取头部左侧及右侧按钮配置或自己配置json
    const getButton = () => {
      leftBtnObj.value = getTopButton([
        { name: "批量完成兑奖", funName: "bacthTafficeClick" }
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
              label:'抽奖人ID:',
          },
          bindVal: 'userid',
          curEleTag: "el-input",
          curOptions: {
               placeholder: translate('抽奖人ID'),
               clearable: true,
               autocomplete: "off",
               type: "text",
          },
        },
        {
          parentEleTag:'el-form-item',
          parentOptions:{
              label:'抽奖人昵称:',
          },
          bindVal: 'usernickname',
          curEleTag: "el-input",
          curOptions: {
               placeholder: translate('抽奖人昵称'),
               clearable: true,
               autocomplete: "off",
               type: "text",
          },
        },
        {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'是否中奖',
        },
        bindVal: 'ishit',
        curEleTag: "el-select",
        childEleTag: "el-option",
        curOptions: {
              placeholder:translate('请选择是否中奖'),
              clearable: true,
        },
        childOptions: ishitSelectData.value,
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
            label:'是否兑现:',
        },
        bindVal: 'iscash',
        curEleTag: "el-select",
        childEleTag: "el-option",
        curOptions: {
              placeholder:translate('请选择是否兑现'),
              clearable: true,
        },
        childOptions: iscashSelectData.value,
      },
    ]};
    //格式化表格某些字段的数据
    const formatStatus = (obj: any) => {
      return obj == 0 ? "未办理" : "已办理";
    };
  
    //列表字段数据获取或json配置
    const getTableColumns = () => {
      tableColumns.value = [
                      {prop: 'userid', label: '抽奖人ID',sortable:true},
                      {prop: 'usernickname', label: '抽奖人昵称',sortable:true},
  
                      {prop: 'addtime', label: '抽奖时间',sortable:true},
  
                      {prop: 'payscore', label: '花费心愿力',sortable:true},
  
                      {prop: 'ishit', label: '是否中奖',sortable:true,list:ishitSelectData.value },
  
                      {prop: 'iscash', label: '是否兑现',sortable:true,list:iscashSelectData.value },
  
                      {prop: 'cashtime', label: '兑现时间',sortable:true},
  
                      {prop: 'operuser', label: '兑现操作人',sortable:true},
  
       ]
    }
  
    const getOperate = () => {
      operateBtn.value = getTopButton([
        { name: "完成兑奖", funName: "tafficeClick"},
      ]) as ButtonProps[];
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
      dialogList.value.modeType = "look";
      dialogList.value.title = "查看";
      dialogList.value.pid = pid;
      dialogList.value = true;
    };
  
    //兑奖
    const tafficeClick = async (pid: number) => {
      console.log(pid);
      ElMessageBox.confirm(`确定要完成兑奖?`).then(
          async () => {
            let res = (await actaffleComplate({ pid: pid })) as any;
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
     //批量兑奖
     const bacthTafficeClick = async () => {
      console.log();
      ElMessageBox.confirm(`确定要完成兑奖?`).then(
          async () => {
            let res = (await acbatchTaffleComplate({ taffleid: taffleid })) as any;
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
    //需要触发的按钮需要在这里定义一下
    const map = new Map([
       ["lookClick", lookClick],
      ['searchClick',searchClick],
      ['resetClick',resetClick],
      ['editClick',editClick],
      ['tafficeClick',tafficeClick],
      ['bacthTafficeClick',bacthTafficeClick]
  
    ])
  
    //字符串转函数方法--列表按钮方法
    const inneroperateClick = (name: string, pid: number,row:any) => {
        if(map.has(name)){
          const func:any = map.get(name);
          console.log(name, pid);
          // dialogList.value.parentEleTag = 'el-dialog'
          func(pid);
        }
    };
  
    //获取列表数据事件
    const getTableList = async () => {
      let params: any = {taffleid:dialogList.value.pid,pageNum: pageNum.value, pageSize: pageSize.value,sortType:sortType.value,sortColumn:sortColumn.value };
      let arr = Object.keys(queryForm);
      for (let i in queryForm) {
        //无时间段可直接使用
        if (arr.includes(i)) {
          Object.assign(params, queryForm);
        }
        //有时间段需自行获取值之后赋值相应属性
        // if (arr.includes(i)) {
        //   if (i == "lgtime" && queryForm[i]) {
        //     params.startTime = queryForm[i][0];
        //     params.endTime = queryForm[i][1];
        //   } else {
        //     params[i] = queryForm[i];
        //   }
        // }
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
    const getiscashSelectData =async () =>{
       let tempSelectData=[{label:"否",value:"0"},{label:"是",value:"1"}]
       let arr:any[] = tempSelectData.map((item:any)=>{
          return {
            label:item.label,
              value:item.value
          }
       })
       debugger;
       iscashSelectData.value = arr
    }
  

const getishitSelectData =async () =>{
     let tempSelectData=[
        {label:"否",value:"0"}
        ,{label:"是",value:"1"}
    ]
     let arr:any[] = tempSelectData.map((item:any)=>{
        return {
            label:item.label,
            value:item.value
        }
     })
     ishitSelectData.value = arr
  }


    let taffleid: any;
// 监听获得弹出框内容
watch(dialogVisible, async (newValue, b) => {
  debugger;
  if (newValue) {
    getDialog();
    var pid=dialogList.value?.pid
    taffleid=dialogList.value?.pid
      await getishitSelectData()
      await getiscashSelectData()
      await getQueryList();
      await getButton();
      await getTableColumns();
      await getOperate();
      await getTableList();
  }
});

const getDialog = () => {
  // 标签名
  dialogList.value.parentEleTag = "el-dialog";
  // 属性
  dialogList.value.parentOptions = {
    modelValue: dialogVisible,
    title: dialogList.value?.title,
    width: "90%",
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
  const handleClose = () => {
    dialogVisible.value = false;
  for (let i = 0; i < dialogList.value.length; i++) {
     const item = dialogList.value[i];
     item.value = "";
  }
};
    //生命周期hooks
    onMounted(async () => {
   
    });
  </script>
  
  <style scoped lang="scss">
    @use "/@/styles/base/base.scss";
    @use "/@/styles/listpage/listpage.scss";
  </style>
  