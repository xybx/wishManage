import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-wish/selectByWishDTO',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/appsystem-wish/del',
    method:'get',
    params
  })
}

export const adminWishComplate = (params:object)=>{
  return request({
    url:'/appsystem-wish/adminWishComplate',
    method:'get',
    params
  })
}

export const bacthActivityWishcomplate = (params:object)=>{
  return request({
    url:'/appsystem-wish/adminBatchWishComplateByActivityId',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/wish/dels',
    method:'get',
    params
  })
}


