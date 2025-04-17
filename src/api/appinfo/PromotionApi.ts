import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-promotion/getPromotionList',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/appsystem-promotion/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/appsystem-promotion/dels',
    method:'get',
    params
  })
}

