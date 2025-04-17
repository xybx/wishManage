import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-comconfig/selectByComconfigDTO',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/appsystem-comconfig/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/appsystem-comconfig/dels',
    method:'get',
    params
  })
}

