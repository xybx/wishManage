import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-wishmessage/selectByWishmessageDTO',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/appsystem-wishmessage/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/appsystem-wishmessage/dels',
    method:'get',
    params
  })
}

export const doused = (params:object)=>{
  return request({
    url:'/appsystem-wishmessage/doused',
    method:'get',
    params
  })
}


