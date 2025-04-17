import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/admin/getUserList',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/sysadmin/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/sysadmin/dels',
    method:'get',
    params
  })
}

