import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-product/getProrecordList',
    method:'get',
    params
  })
}

export const updateStatus = (params:object)=>{
  return request({
    url:'/appsystem-product/updateStatus',
    method:'get',
    params
  })
}

export const batchUpdateStatus = (params:object)=>{
  return request({
    url:'/appsystem-product/batchUpdateStatus',
    method:'get',
    params
  })
}

