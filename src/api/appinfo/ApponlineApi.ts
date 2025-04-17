import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/auth-apponline/selectByApponlineVo',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/apponline/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/apponline/dels',
    method:'get',
    params
  })
}

