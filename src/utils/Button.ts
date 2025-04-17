import type { ButtonProps } from "/@/types/listTypes.ts";

const getTopButton = (arr: ButtonProps[]) => {
  let BtnArr = ref<ButtonProps[] | []>([])
  BtnArr.value = [
    { name: '新增', icon: 'icon-plus3', color: '#48914D', funName: 'AddClick' },
    { name: '添加',  color: '#48914D', funName: 'rowAddClick' },
    { name: '通过', color: '#4484E8', funName: 'agreeClick' },
    { name: '批量删除', icon: 'icon-xiazai', color: '#4484E8', funName: 'batchDel' },
    { name: '添加用户分配', color: '#4484E8', funName: 'addUserAssign' },
    { name: '取消用户分配', color: '#4484E8', funName: 'addUserAssign' },
    { name: '获取模板', icon: 'icon-xiazai', color: '#af993e', funName: 'getTemplate' },
    { name: '导入', icon: 'icon-xiazai', color: '#da1c6b', funName: 'getImport' },
    { name: '导出', icon: 'icon-xiazai', color: '#31ada2', funName: 'getExport' },
    { name: '搜索', color: '#4484E8', funName: 'searchClick' },
    { name: '重置', color: '#A3A5B0', funName: 'resetClick' },
    { name: '编辑', color: '#4484E8', funName: 'editClick' },
    { name: '查看', color: '#48914D', funName: 'lookClick' },
    { name: '查看愿望', color: '#4484E8', funName: 'lookWishClick' },
    { name: '完成愿望', color: '#4484E8', funName: 'wishcomplate' },
    { name: '批量完成愿望', color: '#4484E8', funName: 'bacthWishcomplate' },
    { name: '完成兑奖', color: '#4484E8', funName: 'tafficecomplate' },
    { name: '批量完成兑奖', color: '#4484E8', funName: 'bacthTafficecomplate' },
    { name: '抽奖记录', color: '#4484E8', funName: 'lookTaffleRecordClick' },
    { name: '重置密码', color: '#E32E2E', funName: 'resetPassw' },
    { name: '查看密钥', color: '#48914D', funName: 'resetPassw' },
    { name: '分配用户', color: '#4484E8', funName: 'assignUser' },
    { name: '用户管理', color: '#4484E8', funName: 'resetPassw' },
    { name: '分配服务', color: '#4484E8', funName: 'resetPassw' },
    { name: '服务管理', color: '#4484E8', funName: 'resetPassw' },
    { name: "执行一次", funName: "runClick" ,color: "#48914D"},
    { name: '删除', color: '#E32E2E', funName: 'delClick' },
    { name: '设备号管理', color: '#da1c6b', funName: 'deviceManger' },
    { name: "在线用户", color: '#48914D', funName: "onlineClick" },
    { name: "登录日志", color: '#4484E8', funName: "loginLogClick" },
    { name: "操作日志", color: '#4484E8', funName: "opeLogClick" },
    { name: "展开/折叠", color: '#4484E8', funName: "expandClick" },
    { name: "转移", color: '#4484E8', funName: "transferClick" },
    { name: "管理数据", color: '#4484E8', funName: "dataManageClick" },
    { name: "分配应用", color: '#af52e7', funName: "shareAppClick" },
    { name: "保存选择", color: '#4484E8', funName: "saveClick" },
    { name: "全部分配", color: '#4484E8', funName: "allocate" },
    { name: "应用管理", color: '#4484E8', funName: "shareAppClick" },
    { name: "取消分配", color: '#4484E8',funName: "cancleClick" },
    { name: "取消选择分配",color: '#af52e7', funName: "saveNoClick" },
    { name: "全部取消分配",color: '#4484E8', funName: "Noallocate" },
    { name: "取消", color: '#A3A5B0',funName: "searchClick" },
    { name: "管理人", color: '#af52e7',funName: "manageClick" },
    { name: "采纳", color: '#4484E8',funName: "dousedCkick" },
    { name: "不采纳", color: '#af52e7',funName: "nodousedCkick" },
    { name: "兑换记录", color: '#4484E8',funName: "lookTaffleRecordClick" },
    { name: "礼品兑现", color: '#4484E8',funName: "updateStatus" },
    { name: "礼品批量兑现", color: '#4484E8',funName: "batchUpdateStatus" },
    { name: "处理", color: '#4484E8',funName: "operdata" },
    { name: "收货地址", color: '#4484E8',funName: "seeaddressListWishClick" },
    { name: "回复消息", color: '#4484E8',funName: "replayWishClick" },
    { name: "官方消息", color: '#4484E8',funName: "replayListWishClick" },
    { name: "封号", color: '#af52e7',funName: "suspendAccountClick" },
    { name: "解封", color: '#af52e7',funName: "unsuspendAccountClick" },
    { name: "查看评论", color: '#4484E8',funName: "lookLifeCommentClick" },
    { name: "查看点赞", color: '#4484E8',funName: "lookLifeLikeCommentClick" },
    { name: "发起消息", color: '#4484E8',funName: "sendReplyClick" },
    { name: "发起通知", color: '#4484E8',funName: "sendNoticeClick" },
    
    { name: "查看消息", color: '#4484E8',funName: "seereplayListWishClick" },
    
    
    
    
  ]
  let krr = ref<any[]>([])
  if (Array.isArray(arr)) {
    if (Object.prototype.toString.call(arr) === '[object Array]') {
      for (let i = 0; i < BtnArr.value.length; i++) {
        for (let n = 0; n < arr.length; n++) {
          if (BtnArr.value[i].name == arr[n].name) {
            BtnArr.value[i].funName = arr[n].funName && arr[n].funName != '' ? arr[n].funName : BtnArr.value[i].funName
            BtnArr.value[i].color = arr[n].color && arr[n].color != '' ? arr[n].color : BtnArr.value[i].color
            krr.value.push(BtnArr.value[i])
          }
        }
      }
      return krr.value
    }
  } else {
    let err = '页面按钮数据加载异常'
    throw err
  }
}


export { getTopButton }
