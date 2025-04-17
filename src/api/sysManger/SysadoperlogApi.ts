import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/management-sys-adoperlog/selectBySysAdoperlogVo',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/sysadoperlog/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/sysadoperlog/dels',
    method:'get',
    params
  })
}


export const getbusinesstypeSelectDataApi= ()=>{
  return request({
    url: '/management-sys-adoperlog/getBusinessTypeSelected',
    method:'get',
  })
}

