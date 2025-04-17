import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-notifications/selectByNotificationsDTO',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/appsystem-notifications/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/appsystem-notifications/dels',
    method:'get',
    params
  })
}

