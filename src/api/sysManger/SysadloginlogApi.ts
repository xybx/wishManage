import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/sys-adloginlog/selectBySysAdloginlogVo',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/sysadloginlog/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/sysadloginlog/dels',
    method:'get',
    params
  })
}
export const exportExcel = (params:object)=>{
  return request({
    url:'/sys-adloginlog/export',
    method:'get',
    params
  })
}

