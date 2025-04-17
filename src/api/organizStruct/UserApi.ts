import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-user/selectByUserDTO',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/appsystem-user/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/appsystem-user/dels',
    method:'get',
    params
  })
}

export const suspendAccount = (params:object)=>{
  return request({
    url:'/appsystem-user/suspendAccount',
    method:'get',
    params
  })
}

export const unsuspendAccount = (params:object)=>{
  return request({
    url:'/appsystem-user/unsuspendAccount',
    method:'get',
    params
  })
}

