<template>
  <component :is="dialogList?.parentEleTag" v-bind="dialogList?.parentOptions">
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
      v-model:fit="fit"
      @sortClick="sortChange"
      @rowClick="rowClick"
      @selectClick="handleSelectionChange"
      @operateClick="operateClick"
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
      v-model:deptpid="deptpid"
      v-model:dialogList="innerdialogList"
    />

  </component>
</template>

<script setup lang="ts">
  import buttonRef from "/src/components/global/buttonRef.vue";
  import tableRef from "/src/components/global/tableRef.vue";
  import editDialog from "./DeptheadDialog.vue";
  import type {
    TableColumnProps,
    TableProps,
    ButtonProps,
    JsonProps,
    DialogProps,
  } from "/@/types/orgStruct/DeptheadTypes";
  import {delDepthead, getDeptheadListApi} from "/@/api/organizStruct/DeptheadApi";
  import { getTopButton } from "/@/utils/Button.ts";
  import { ElMessage, ElMessageBox } from "element-plus";
  defineOptions({
    name: 'DeptheadListDialog',
  });

  const route = useRoute();
  let title: any = route.meta.title;
  const btnRef = ref<any>();
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
  const selectedRows = ref<string[]>([]);
  const fit = ref<boolean>(true)
  const dialogVisible = defineModel<boolean>("dialogVisible");
  const dialogList = defineModel<DialogProps | any>("dialogList");
  const innerdialogVisible = ref<boolean>(false);
  const innerdialogList = ref<DialogProps>({});
  const deptpid = ref<string| number>('')
  let type = ref<string>('')

  // 获取头部左侧及右侧按钮配置或自己配置json
  const getButton = () => {
    leftBtnObj.value = getTopButton([
      { name: "新增", funName: "addClick" },
    ]) as ButtonProps[];
  };

  watch(dialogVisible,async (newValue,b)=>{
    if(newValue){
      getDialog()
      type.value = dialogList.value.modeType;
      deptpid.value = dialogList.value.pid
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
      width: "64%",
      class: "dialogbox",
      "close-on-click-modal": false,
      appendToBody: true,
      "align-Center": true,
      center: true,
      "before-close": handleClose,
    };
  };

  const handleClose = ()=>{
    dialogList.value.title = ''
    dialogVisible.value = false;
  }

  //列表字段数据获取或json配置
  const getTableColumns = () => {
    tableColumns.value = [
      {prop: 'truename', label: '姓名',sortable:true},
      {prop: 'phonenumber', label: '手机号',sortable:true},
      {prop: 'gradename', label: '级别',sortable:true},
      {prop: 'deptname', label: '部门',sortable:true},
     ]
  }

  const getOperate = () => {
    operateBtn.value = getTopButton([
      { name: "删除", funName: "delClick" },
    ]) as ButtonProps[];
  };

  //添加事件
  const addClick = () => {
    innerdialogList.value.modeType = "add";
    innerdialogList.value.title = "新增";
    innerdialogVisible.value = true;
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
  const editClick = (pid: number,row:any) => {
    console.log(pid);
    innerdialogList.value.modeType = "edit";
    innerdialogList.value.title = "编辑";
    innerdialogList.value.subData = row;
    innerdialogVisible.value = true;
  };

  //删除事件
  const delClick = async (pid: number,row:any) => {
    ElMessageBox.confirm(`确定要删除该信息吗?`).then(
        async () => {
          let res = (await delDepthead({ pid: pid })) as any;
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
    ['addClick',addClick]
  ])

  const argmap = new Map([
    ['delClick',delClick]
  ])


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

  //字符串转函数方法--列表按钮方法
  const operateClick = (name: string, pid: number,row:any) => {
      if(argmap.has(name)){
        const func:any = argmap.get(name);
        func(pid,row);
      }
  };

  //获取列表数据事件
  const getTableList = async () => {
    let params = { pageNum: pageNum.value, pageSize: pageSize.value,sortType:sortType.value,sortColumn:sortColumn.value,deptpid:dialogList.value.pid};
    let res: any = await getDeptheadListApi(params);
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
</script>

<style scoped lang="scss">
  @use "/@/styles/base/base.scss";
  @use "/@/styles/listpage/listpage.scss";
</style>
