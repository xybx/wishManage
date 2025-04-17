import request from '/@/utils/request'

export const getSourceList = (params:object)=>{
  return request({
    url:'/datasource22/selectByDatasource22Vo',
    method:'get',
    params
  })
}
export const del = (params:object)=>{
  return request({
    url:'/datasource22/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/datasource22/dels',
    method:'get',
    params
  })
}

