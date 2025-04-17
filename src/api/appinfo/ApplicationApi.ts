import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/auth-application/selectByApplicationVo',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/auth-application/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/application/dels',
    method:'get',
    params
  })
}

