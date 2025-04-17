import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/auth-device/getUnCheckDevice',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/auth-device/del',
    method:'get',
    params
  })
}
export const CheckDeviceApi = (params:object)=>{
  return request({
    url:'/auth-device/CheckDevice',
    method:'get',
    params
  })
}



// 用户管理中设备号管理
export const getDeviceListApi = (params:object)=>{
  return request({
    url: '/auth-device/getCheckedDevice',
    method:'get',
    params
  })
}

export const addApi = (data:object)=>{
  return request({
    url: '/auth-device/add',
    method:'post',
    data
  })
}
export const updateApi = (data:object)=>{
  return request({
    url: '/auth-device/update',
    method:'post',
    data
  })
}
export const selectVoByPidPid = (params:object)=>{
  return request({
    url: '/auth-device/selectVoByPid',
    method:'get',
    params
  })
}